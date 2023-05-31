import React, { useState, useEffect } from "react";
import Form from 'react-bootstrap/Form'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import Button from 'react-bootstrap/Button';
import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';
import { react_constants } from '../../components/constants'
import { messages } from '../../components/messagesEnum'
import { useNavigate, useParams } from 'react-router-dom'
import { SnackBarAlert } from '../../components/snackBarAlert'
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import "../styles.css";

const questionDefault = {
    codigo: 0,
    descricao: "",
    codigo_acao: null,
    ativo: true
}

function FormularioPergunta(){
    const navigate = useNavigate();
    const { id } = useParams();
    const [question, setQuestion] = useState(questionDefault);
    const [actions, setActions] = useState([]);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [type, setType] = useState("");
    const [declaredAction, setDeclaredAction] = useState(0);

    useEffect(() => {
        if (id !== undefined && id !== null) {
            fetch(`${react_constants["local_api"]}/pergunta/${id}`)
                .then(retorno => retorno.json())
                .then(retorno_convertido => {
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                    setDeclaredAction(retorno_convertido[0].codigo_acao)
                    setQuestion(retorno_convertido[0])
                })
        }

        fetch(`${react_constants["local_api"]}/acoes/ativas`)
            .then(retorno => retorno.json())
            .then(retorno_convertido => (
                setActions(retorno_convertido)
            ))
    }, [id]);

    const onChangeValue = (e) => {
        setQuestion({...question, [e.target.name]:e.target.value})
    }

    const onChangeValueSwitch = (e) => {
        setQuestion({...question, [e.target.name]:e.target.checked})
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event) => {
        setDeclaredAction(event.target.value);
        setQuestion({...question, codigo_acao:event.target.value});
    };
    
    const handleSubmit = () => {
        let rota = "pergunta";
        let metodo = "";
        if (id !== undefined && id !== null && id !== 0) {
            metodo = "put";
            rota = rota+`/${id}`
        } else {
            metodo = "post";
        }
        fetch(`${react_constants["local_api"]}/${rota}`,{
            method:metodo,
            body:JSON.stringify(question),
            headers:{
                'Content-type':'application/json',
                'Accept':'application/json'
            }
        })
        .then(retorno => retorno.json())
        .then(retorno_convertido => {
            if (retorno_convertido.message !== undefined) {
                setMessage(retorno_convertido.message);
                setType("error");
            } else {
                setMessage(messages["succesToSave"]);
                setType("success");
                handleCancel()
            }
            setOpen(true);
        })
    }
    
    const handleCancel = () => {
        navigate('/questions')
    }

    return(
        <FormGroup>
            <Form style={{ padding: '0px 10px' }}>
                <div>
                    <TextField id="descricao" name="descricao" value={question.descricao} label="Pergunta (Limite de 300 caracteres)" variant="standard" onChange={onChangeValue} style={{ minWidth: 350, float: "left" }}  />
                </div>
                <br />
                <br />
                <br />
                <div>
                    <FormControl variant="outlined" sx={{ m: 1, minWidth: 350, float: "left" }}>
                        <InputLabel id="demo-mutiple-name-label">Ação Relacionada</InputLabel>
                        <Select
                            labelId="demo-multiple-name-label"
                            id="demo-multiple-name"
                            value={declaredAction}
                            onChange={handleChange}
                            input={<OutlinedInput label="Ação Relacionada" />}
                        >
                        {actions.map((acao,indice) => (
                            <MenuItem
                                key={acao + indice}
                                name={acao.title}
                                value={acao.codigo}
                            >
                                {acao.title}
                            </MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                </div>
                <div style={{ marginTop: 10 }}>
                    <FormControlLabel style={{ minWidth: "100%" }} control={<Switch onChange={onChangeValueSwitch} checked={question.ativo} value={question.ativo} name="ativo" />} label="Ação ativa?" />
                </div>
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
            </Form>
            <SnackBarAlert open={open} type={type} message={message} handleClose={handleClose} />            
        </FormGroup>
    )
}

export default FormularioPergunta;
