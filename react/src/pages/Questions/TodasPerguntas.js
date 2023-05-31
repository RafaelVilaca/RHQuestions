import React, { useState, useEffect } from "react";
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { react_constants } from '../../components/constants';
import { useNavigate, useParams } from 'react-router-dom';
import { SnackBarAlert } from '../../components/snackBarAlert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ThumbUpAltTwoToneIcon from '@mui/icons-material/ThumbUpAltTwoTone';
import ThumbDownAltTwoToneIcon from '@mui/icons-material/ThumbDownAltTwoTone';
import { ConfirmationDialog } from '../../components/ConfirmationDialog';
import { messages } from '../../components/messagesEnum';
import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import "../styles.css";
import { Typography } from "@mui/material";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

const actionDefault = {
    codigo: 0,
    title: "",
    descricao: "",
    prazo_inicial: new Date(),
    prazo_final: new Date(),
    codigo_empresa: null,
    ativo: true
}

function TodasPerguntas(){
    const navigate = useNavigate();
    const { id } = useParams();

    const [action, setAction] = useState(actionDefault)
    const [questions, setQuestions] = useState([])

    const handleCancel = () => {
        navigate('/home')
    }

    useEffect(() => {
        if (id !== undefined && id !== null) {
            fetch(`${react_constants["local_api"]}/allQuestions/${id}`)
                .then(retorno => retorno.json())
                .then(retorno_convertido => {
                    setQuestions(retorno_convertido)
                })
            
            fetch(`${react_constants["local_api"]}/acao/${id}`)
                .then(retorno => retorno.json())
                .then(retorno_convertido => (
                    setAction(retorno_convertido[0])
                ))
        }
    }, [id])

    const handleSubmit = () => {}

    return(
        <Form>
            <Card sx={{ minWidth: 275 }} style={{ backgroundColor: 'lightgray' }}>
                <CardContent>
                    <Typography variant="h5" component="div">
                        {action.title}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {action.descricao}
                    </Typography>
                </CardContent>
            </Card>
            {Array.isArray(questions) && questions.map((question, indice) => (
                <Card id={indice} key={indice} sx={{ minWidth: 275 }} style={{ backgroundColor: 'ghostwhite', margin: '5px' }}>
                    <CardContent>
                        <Typography color="text.secondary">{question.descricao}</Typography>
                        <Typography align="left">Resposta:</Typography>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                        >
                            <FormControlLabel key={'0' + question.codigo + question.indice} value="0" control={<Radio />} label="0" />
                            <FormControlLabel key={'1' + question.codigo + question.indice} value="1" control={<Radio />} label="1" />
                            <FormControlLabel key={'2' + question.codigo + question.indice} value="2" control={<Radio />} label="2" />
                            <FormControlLabel key={'3' + question.codigo + question.indice} value="3" control={<Radio />} label="3" />
                            <FormControlLabel key={'4' + question.codigo + question.indice} value="4" control={<Radio />} label="4" />
                            <FormControlLabel key={'5' + question.codigo + question.indice} value="5" control={<Radio />} label="5" />
                        </RadioGroup>
                    </CardContent>
                </Card>
            ))}
            <div style={{ marginTop: 10 }}>
                <div className="d-grid gap-2" style={{ maxWidth: 150, float: "left" }}>
                    <Button id="save" variant="success" style={{ minWidth: 120 }} onClick={handleSubmit}>
                        <DoneIcon fontSize="small" />
                        <span style={{ fontSize: "smaller", fontWeight: "bold" }}>Salvar</span>
                    </Button>
                </div>
                <div className="d-grid gap-2" style={{ maxWidth: 150, float: "right" }}>
                    <Button id="cancel" variant="danger" style={{ minWidth: 120 }} onClick={handleCancel}>
                        <ClearIcon fontSize="small" />
                        <span style={{ fontSize: "smaller", fontWeight: "bold" }}>Cancelar</span>
                    </Button>
                </div>
            </div>

            {/* <ConfirmationDialog 
                open={confirmDialog}
                firstArgument={firstArgument}
                secondArgument={secondArgument}
                confirmation={() => {deletePress()}} 
                onClose={() => {confirmationCloseDialog()}}
                title={'usuário'}
            />
            <SnackBarAlert open={openToast} type={type} message={message} handleClose={() => {closeToast()}} />   */}
        </Form>
    )
}

export default TodasPerguntas;
