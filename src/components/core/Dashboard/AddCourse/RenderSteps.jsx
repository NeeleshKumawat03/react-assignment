import React from 'react'
import { FaCheck } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import CourseInformationForm from './CourseInformation/CourseInformationForm'
import CourseBuilderForm from './CourseBuilder/CourseBuilderForm'

const steps = [
    {
        id: 1,
        title: "Course Information",
    },
    {
        id: 2,
        title: "Course Builder",
    },
    {
        id: 3,
        title: "Publish",
    },
]


const RenderSteps = () => {
    const {step} = useSelector((state) => state.course)
  return (
    <>
        <div>
            {steps.map((item) => (
                <>
                    <div>
                        <div>
                            {
                                step > item.id ? (<FaCheck/>) : (item.id)
                            }
                        </div>
                    </div>
                    {/* Dashes */}
                </>
            ))}
        </div>
        <div>
            {steps.map(item => (
                <>
                    <div>
                        <p>{item.title}</p>
                    </div>
                </>
            ))}
        </div>

        {step === 1 && <CourseInformationForm />}
        {step === 2 && <CourseBuilderForm />}
        {/* {step === 3 && <PublishCourse />} */}
    </>
  )
}

export default RenderSteps