import React from 'react';
import {Flex, Spacer, Text} from '@chakra-ui/react';
import {Course, Grade, Term} from '../types/transcript';

export type CourseGradeProps = {
    course : Course;
    grade : Grade;
    term : Term;
}

export const CourseGrade : React.FunctionComponent<CourseGradeProps> = props => {
    return <Flex>
        <Text>Course: {props.course} :</Text>
        <Spacer/>
        <Text>Grade: {props.grade}</Text>
        <Spacer/>
        <Text>Term: {props.term}</Text>
    </Flex>
}