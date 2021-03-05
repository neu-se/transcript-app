import React from "react";

import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    List,
    ListIcon,
    ListItem,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Spacer,
    Text,
    useDisclosure,
    useToast
} from "@chakra-ui/react"

import {Grade, Transcript as TranscriptType} from '../types/transcript';
import {MdCheckCircle, MdRemoveCircle} from "react-icons/all";
import {remoteTranscriptManager} from "../client/client";
import {RefreshStudentCallbackType} from "./TranscriptApp";

const gradeList = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F', 'I', 'P', 'NP', 'S', 'U', 'NR'];

export type TranscriptProps = {
    transcript: TranscriptType;
    refreshTranscript: RefreshStudentCallbackType;
}

function renderGrade(grade: { course: string, grade: Grade }) {
    let icon = MdCheckCircle;
    let iconColor = "green.500";
    if (grade.grade === Grade.F) {
        icon = MdRemoveCircle;
        iconColor = "red.500";
    }
    return <ListItem key={grade.course + "." + grade.grade}>
        <ListIcon as={icon} color={iconColor}/>{grade.course}: {grade.grade}%</ListItem>;
}

const AddGradeOverlay: React.FunctionComponent<{ studentID: number, refreshTranscript: RefreshStudentCallbackType }> = ({studentID, refreshTranscript}) => {
    const {isOpen: addGradeOpen, onOpen: onOpenAddGrade, onClose: onCloseAddGrade} = useDisclosure()
    const toast = useToast()

    return <>
        <Button onClick={onOpenAddGrade}>Add Grade</Button>
        <Modal isOpen={addGradeOpen} onClose={onCloseAddGrade}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>Add a grade</ModalHeader>
                <ModalCloseButton/>
                <form onSubmit={async (event) => {
                    event.preventDefault();
                    // @ts-ignore
                    const formElements = event.target as HTMLInputElement[];
                    const courseName = formElements[0].value
                    let gradeTemp = gradeList.find(val => val === formElements[1].value);
                    let grade : Grade =  Grade['A'];
                    if (gradeTemp) {
                        grade = Grade['A']
                    }
                    
                    try {
                        await remoteTranscriptManager.addGrade(studentID, courseName,Grade['A']);
                        toast({
                            title: "Grade Saved!",
                            isClosable:true,
                            duration: 1500,
                            status: "success"
                        })
                        await refreshTranscript(studentID);
                        onCloseAddGrade();
                    } catch (err) {
                        toast({
                            title: "An error occurred",
                            description: "Unable to add grade",
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
                            <FormLabel>Course</FormLabel>
                            <Input placeholder="Course" name="course"/>
                        </FormControl>

                        <FormControl mt={4} isRequired>
                            <FormLabel>Grade</FormLabel>
                            <Select placeholder="Select option">
                            {gradeList.map(val => (<option value={val}>{val}</option>))}
                            </Select>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} type="submit">
                            Save
                        </Button>
                        <Button onClick={onCloseAddGrade}>Cancel</Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    </>
}
export const StudentView: React.FunctionComponent<TranscriptProps> = ({transcript, refreshTranscript}) => {
    return <Box borderWidth="1px" borderRadius="lg">
        Name: {transcript.student.studentName}
        <Spacer/>
        <> <Text>ID: {transcript.student.studentID}</Text>
        </>
        Grades: <List
        fontSize="md">{transcript.grades.sort((g1, g2) => g1.course.localeCompare(g2.course)).map(grade => renderGrade(grade))}</List>
        <AddGradeOverlay refreshTranscript={refreshTranscript} studentID={transcript.student.studentID}/>
    </Box>;
}
