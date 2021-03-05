import React from "react";
import {RefreshStudentCallbackType} from "./TranscriptApp";
import {
    Button, FormControl, FormLabel, Input,
    Modal, ModalBody,
    ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper,
    useDisclosure,
    useToast
} from "@chakra-ui/react";
import {remoteTranscriptManager} from "../client/client";
import { updateBaseURL } from "../client/remoteService"

export const AddRESTModal: React.FunctionComponent<{ appendTranscript: (newID: number)=>Promise<void> }> = ({appendTranscript}) => {
    const {isOpen, onOpen, onClose} = useDisclosure()
    const toast = useToast()

    return <>
        <Button onClick={onOpen}>Change REST Server</Button>
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay/>
        <ModalContent>
            <ModalHeader>Change REST Base URL</ModalHeader>
    <ModalCloseButton/>
    <form onSubmit={async (event) => {
        event.preventDefault();
        // @ts-ignore
        const formElements = event.target as HTMLInputElement[];
        const studentName = formElements[0].value;
        try {
            const newID = await remoteTranscriptManager.addStudent(studentName);
            toast({
                title: `Student ${studentName} added, ID# ${newID}!`,
                isClosable:true,
                duration: 1500,
                status: "success"
            })
            appendTranscript(newID);
            onClose();
        } catch (err) {
            toast({
                title: "An error occurred",
                description: "Unable to add new student",
                status: "error",
                isClosable: true,
                duration: 3000
            })
            console.log(err);
        }
        return false;
    }}>
    <ModalBody pb={6}>
        <FormControl isRequired>
        <FormLabel>Base URL</FormLabel>
        <Input placeholder="Name" name="studentNaem"/>
        </FormControl>
    </ModalBody>

    <ModalFooter>
    <Button colorScheme="blue" mr={3} type="submit">
        Add
        </Button>
        <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
        </form>
        </ModalContent>
        </Modal>
        </>
}
