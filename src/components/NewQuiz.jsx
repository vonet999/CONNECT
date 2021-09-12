import React,{ useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import { socket } from './EnterCodeForm'
import ReactDOM from 'react-dom'
import '../style/NewQuizStyle.css'

import { Chip, TextField, Button, Typography, Divider } from '@material-ui/core';

import firebase from "firebase"
import "firebase/database";
import { toast } from 'react-toastify'
import { AddCircleRounded, DeleteRounded } from '@material-ui/icons'
import UploadButton from './UploadButton'

import Translations from '../translations/translations.json'

export default function NewQuiz() {

    const [question, setQuestion] = useState(0)
    const [questionArray, setQuestionArray] = useState([1,2,3,4,5,6])

    const [tags, setTags] = useState([]);
    const [currentTag, setCurrentTag] = useState('');
    const [tagNumber, setTagNumber] = useState(0);


    const quizObj = {}

    useEffect(() => {
        toast.info(Translations[localStorage.getItem('connectLanguage')].alerts.eachansdifferent)
    }, [])

    const Submit = () => {
        for(var i = 0; i < document.getElementsByClassName('userInput').length; i++){
            console.log('userIn')
            if(document.getElementsByClassName('userInput')[i].value == ""){
                toast.error(Translations[localStorage.getItem('connectLanguage')].alerts.fieldleftempty)
                return
            }
        }
        firebase.database().ref(`quizes/`).push(quizObj)
        toast.success(Translations[localStorage.getItem('connectLanguage')].alerts.quizcreated)
        for(var i = 0; i < document.getElementsByClassName('userInput').length; i++){
            document.getElementsByClassName('userInput')[i].value = ""
        }

        
    }
    const getTags = () => {
        const newTagArr = []
        tags.map((tag) => {
            newTagArr.push(tag)
        })
        return newTagArr
    }

    const setQuizObj = () => {
        if(JSON.parse(localStorage.getItem('user')) == null) {
            window.location = '/login'
            toast.error(Translations[localStorage.getItem('connectLanguage')].alerts.logincreatequiz)
            return
        }
        console.log(document.getElementsByClassName('questions'))

        quizObj.name = document.getElementById('quizName').value
        quizObj.userName = JSON.parse(localStorage.getItem('user')).profileObj.name
        quizObj.userProfilePic = JSON.parse(localStorage.getItem('user')).profileObj.imageUrl
        quizObj.userID = JSON.parse(localStorage.getItem('user')).profileObj.googleId
        quizObj.coverImg = document.getElementById('coverImg').src
        quizObj.tags = getTags()

        for(var i = 0; i < document.getElementsByClassName('questions').length; i++){
            console.log(document.getElementsByClassName('questions')[i].value + ' ' +  document.getElementsByClassName('questions')[i].value)
            quizObj[`q${i}`] = {
                question: document.getElementsByClassName('questions')[i].value,
                answer: document.getElementsByClassName('answers')[i].value
            } 
        }

        console.log(quizObj)
        Submit()
    }

    const Card = ({questionNumber}) => (
        <div className='card2' id={`question${questionNumber}card`}>
            <h1>{Translations[localStorage.getItem('connectLanguage')].newquiz.questions.title} {questionNumber}</h1>
            <input className='questions userInput' id={`question${questionNumber}`} type='text' placeholder={Translations[localStorage.getItem('connectLanguage')].newquiz.questions.question}/>
            <br></br><input className='answers userInput' id={`answer${questionNumber}`} type='text' placeholder={Translations[localStorage.getItem('connectLanguage')].newquiz.questions.answer} />
        </div>
    )

    const AddQuestion = () => {
        setQuestion(question + 1)
        setQuestionArray( [...questionArray, question])
    }

    const AddTag = (tag) => {
        if(tag === '') return
        if(tagNumber >= 5) return
        setTags([...tags, tag])
        setCurrentTag('')
        setTagNumber(tagNumber+1)
    }

    const handleDelete = (id, name) => {
        const newTags = []
        tags.map((tag) => {
            newTags.push(tag)
        })
        newTags.splice(name, 1)
        setTags(newTags)
        setTagNumber(newTags.length)

    };

    return (
        <div style={{marginTop:'100px'}}>
            <div style={{display:'flex', alignItems:'center', flexDirection:'column', backgroundColor:'white', margin:'10px', border:'2px solid black', boxShadow:'10px 10px 0 #262626'}}>
                <div style={{display:'flex', alignItems:'center', flexDirection:'column'}}>
                    <Typography variant="h2" style={{margin:'10px'}}><b>{Translations[localStorage.getItem('connectLanguage')].newquiz.title}</b></Typography>
                    <br></br>
                    <Divider style={{width:'90vw'}} light/>
                    <br></br>
                    <Typography variant="h5" style={{margin:'10px'}}>{Translations[localStorage.getItem('connectLanguage')].newquiz.step1}</Typography>
                    <input className='userInput' id={'quizName'} type='text' placeholder={Translations[localStorage.getItem('connectLanguage')].newquiz.input}></input>
                </div>
                <div style={{width:'100%', display:'flex', alignItems:'center', flexDirection:'column', marginTop:'100px'}}>
                    <Typography variant="h5" style={{margin:'10px'}}>{Translations[localStorage.getItem('connectLanguage')].newquiz.step2}</Typography>
                    <UploadButton/>
                </div>
                <Typography variant="h5" style={{margin:'10px', marginTop:'100px'}}>{Translations[localStorage.getItem('connectLanguage')].newquiz.step3}</Typography>
                <div style={{backgroundColor:'white', padding:'15px', border:'2px solid black', boxShadow:'10px 10px 0 #262626', width:'80vw', maxWidth:'600px', marginTop:'50px'}}>
                    <Typography variant="h3">{Translations[localStorage.getItem('connectLanguage')].newquiz.tags.title}</Typography>
                    <br></br>
                    <Divider light/>
                    <br></br>
                    <TextField variant="outlined" size='small' label={Translations[localStorage.getItem('connectLanguage')].newquiz.tags.input} helperText={<span style={{color:'black'}}>{5-tagNumber} {Translations[localStorage.getItem('connectLanguage')].newquiz.tags.helpertext}</span>} onChange={(e)=>{setCurrentTag(e.target.value)}} value={currentTag}/>
                    <Button variant="contained" size='medium' color="primary" onClick={()=>{AddTag(currentTag)}}>{Translations[localStorage.getItem('connectLanguage')].newquiz.tags.button}</Button>
                    <br></br>
                    {
                        tags.map((tag, index) => (
                            <Chip style={{marginTop:'10px'}} key={tag+index} id={tag+index} label={tag} onDelete={()=>handleDelete(tag+index, tag)} color="primary" />
                        ))
                    }
                </div>
                <Typography variant="h5" style={{margin:'10px', marginTop:'100px'}}>{Translations[localStorage.getItem('connectLanguage')].newquiz.step4}</Typography>
                <div className='cardContainer2' style={{margin:'1%', marginTop:'10px'}}>
                    {
                        questionArray.map((question, i) => (
                            <Card key={i} questionNumber={i+1}/>
                        ))
                    }
                    <div onClick={()=>{AddQuestion()}} className='card2-2' style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                        <AddCircleRounded style={{width:'75px', height:'75px'}} color='primary'/>
                    </div>
                </div>
                <div>
                    <Button style={{marginBottom:'1vh'}} variant="contained" color="primary" size='large' onClick={()=>{setQuizObj()}}>{Translations[localStorage.getItem('connectLanguage')].newquiz.button}</Button>
                </div>
            </div>
        </div>
    )
}
