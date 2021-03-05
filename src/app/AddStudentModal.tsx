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
import {deleteTranscript, remoteTranscriptManager} from "../client/client";
import {transcriptManager} from "../types/local-transcript-manager";

export const DeleteStudentModal: React.FunctionComponent<{ deleteTrandscript: (transcriptID: number)=>Promise<void> }> = ({deleteTrandscript}) => {
    const {isOpen, onOpen, onClose} = useDisclosure()
    const toast = useToast()

    return <>
        <Button onCLick={onOpen}>Delete Transcript</Button>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>Delete a transcript</ModalHeader>
                <ModalCloseButton/>
                <form onSubmit={async (event) => {
                    event.preventDefault();

                    const formElements = event.target as unknown as HTMLInputElement[];
                    const studentName = formElements[0].value;
                    try {
                        const studentID = await transcriptManager.getStudentIDs(studentName)
                        const transcriptDelete = await transcriptManager.getTranscript(studentID[0]);
                        toast({
                            title: `Transcript ${transcriptDelete} deleted!`,
                            isClosable:true,
                            duration: 1500,
                            status: "success"
                        })
                        await transcriptManager.getTranscript(studentID[0]);
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
                            <FormLabel>Student Name</FormLabel>
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

export const AddStudentModal: React.FunctionComponent<{ appendTranscript: (newID: number)=>Promise<void> }> = ({appendTranscript}) => {
    const {isOpen, onOpen, onClose} = useDisclosure()
    const toast = useToast()

    return <>
        <Button onClick={onOpen}>Add Student</Button>
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay/>
        <ModalContent>
            <ModalHeader>Add a new student</ModalHeader>
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
        <FormLabel>Student Name</FormLabel>
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
