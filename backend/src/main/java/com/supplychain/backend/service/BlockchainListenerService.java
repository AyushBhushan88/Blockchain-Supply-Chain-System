package com.supplychain.backend.service;

import com.supplychain.backend.messaging.KafkaProducer;
import com.supplychain.backend.messaging.ProductEvent;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.abi.EventEncoder;
import org.web3j.abi.FunctionReturnDecoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.Event;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.Utf8String;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.abi.datatypes.generated.Uint8;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.request.EthFilter;
import org.web3j.protocol.core.methods.response.Log;

import java.util.Arrays;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class BlockchainListenerService {

    private final Web3j web3j;
    private final KafkaProducer kafkaProducer;

    @Value("${contract.address}")
    private String contractAddress;

    // Event Definitions
    private static final Event PRODUCT_REGISTERED_EVENT = new Event("ProductRegistered",
            Arrays.asList(
                    new TypeReference<Uint256>(true) {},
                    new TypeReference<Address>(true) {},
                    new TypeReference<Utf8String>(false) {}
            )
    );

    private static final Event PRODUCT_STATUS_UPDATED_EVENT = new Event("ProductStatusUpdated",
            Arrays.asList(
                    new TypeReference<Uint256>(true) {},
                    new TypeReference<Uint8>(false) {},
                    new TypeReference<Address>(true) {}
            )
    );

    private static final String PRODUCT_REGISTERED_TOPIC = EventEncoder.encode(PRODUCT_REGISTERED_EVENT);
    private static final String PRODUCT_STATUS_UPDATED_TOPIC = EventEncoder.encode(PRODUCT_STATUS_UPDATED_EVENT);

    @PostConstruct
    public void listenToEvents() {
        log.info("Starting Blockchain Event Listener for contract: {}", contractAddress);

        EthFilter filter = new EthFilter(DefaultBlockParameterName.LATEST, DefaultBlockParameterName.LATEST, contractAddress);

        web3j.ethLogFlowable(filter).subscribe(logMessage -> {
            String topic = logMessage.getTopics().get(0);
            if (topic.equals(PRODUCT_REGISTERED_TOPIC)) {
                processProductRegistered(logMessage);
            } else if (topic.equals(PRODUCT_STATUS_UPDATED_TOPIC)) {
                processProductStatusUpdated(logMessage);
            }
        }, throwable -> {
            log.error("Error in blockchain event listener: ", throwable);
        });
    }

    private void processProductRegistered(Log logMessage) {
        List<Type> nonIndexedValues = FunctionReturnDecoder.decode(
                logMessage.getData(), PRODUCT_REGISTERED_EVENT.getNonIndexedParameters());
        
        // Indexed parameters are in topics (excluding the first one which is the event signature)
        Uint256 productId = (Uint256) FunctionReturnDecoder.decodeIndexedValue(
                logMessage.getTopics().get(1), new TypeReference<Uint256>(true) {});
        Address manufacturer = (Address) FunctionReturnDecoder.decodeIndexedValue(
                logMessage.getTopics().get(2), new TypeReference<Address>(true) {});
        
        String metadata = (String) nonIndexedValues.get(0).getValue();

        log.info("Detected ProductRegistered event: ID={}, Manufacturer={}", productId.getValue(), manufacturer.getValue());

        ProductEvent event = ProductEvent.builder()
                .eventType("REGISTERED")
                .blockchainId(productId.getValue().longValue())
                .status("CREATED")
                .actor(manufacturer.getValue())
                .metadata(metadata)
                .build();

        kafkaProducer.sendEvent(event);
    }

    private void processProductStatusUpdated(Log logMessage) {
        List<Type> nonIndexedValues = FunctionReturnDecoder.decode(
                logMessage.getData(), PRODUCT_STATUS_UPDATED_EVENT.getNonIndexedParameters());

        Uint256 productId = (Uint256) FunctionReturnDecoder.decodeIndexedValue(
                logMessage.getTopics().get(1), new TypeReference<Uint256>(true) {});
        Address actor = (Address) FunctionReturnDecoder.decodeIndexedValue(
                logMessage.getTopics().get(2), new TypeReference<Address>(true) {});

        int statusIndex = ((Uint8) nonIndexedValues.get(0)).getValue().intValue();
        String status = mapStatus(statusIndex);

        log.info("Detected ProductStatusUpdated event: ID={}, Status={}, Actor={}", 
                productId.getValue(), status, actor.getValue());

        ProductEvent event = ProductEvent.builder()
                .eventType("STATUS_UPDATED")
                .blockchainId(productId.getValue().longValue())
                .status(status)
                .actor(actor.getValue())
                .build();

        kafkaProducer.sendEvent(event);
    }

    private String mapStatus(int index) {
        // Matches enum ProductStatus { Created, InTransitToDistributor, AtDistributor, InTransitToRetailer, AtRetailer, Sold }
        switch (index) {
            case 0: return "CREATED";
            case 1: return "IN_TRANSIT_TO_DISTRIBUTOR";
            case 2: return "AT_DISTRIBUTOR";
            case 3: return "IN_TRANSIT_TO_RETAILER";
            case 4: return "AT_RETAILER";
            case 5: return "SOLD";
            default: return "UNKNOWN";
        }
    }
}
