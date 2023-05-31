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
import { cnpjMask } from '../../components/cnpjMask'
import "../styles.css"

const companyDefault = {
    codigo: 0,
    nome: "",
    cnpj: "",
    ativo: true
}

function FormularioCompany(){
    const navigate = useNavigate();
    const { id } = useParams();
    const [company, setCompany] = useState(companyDefault);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [type, setType] = useState("");

    const [isDesktop, setIsDesktop] = useState(
        window.matchMedia("(min-width: 767px)").matches
    )

    useEffect(() => {
        window
        .matchMedia("(min-width: 767px)")
        .addEventListener('change', e => setIsDesktop( e.matches ));

        if (id !== undefined && id !== null) {
            fetch(`${react_constants["local_api"]}/empresa/${id}`)
                .then(retorno => retorno.json())
                .then(retorno_convertido => setCompany(retorno_convertido[0]))
        }
    }, [id]);

    const onChangeValue = (e) => {
        setCompany({...company, [e.target.name]:e.target.value})
    }

    const onChangeValueSwitch = (e) => {
        setCompany({...company, [e.target.name]:e.target.checked})
    }

    const handleClose = () => {
        setOpen(false);
    };
    
    const handleSubmit = () => {
        let rota = "empresa";
        let metodo = "";
        if (id !== undefined && id !== null && id !== 0) {
            metodo = "put";
            rota = rota+`/${id}`
        } else {
            metodo = "post";
        }
        fetch(`${react_constants["local_api"]}/${rota}`,{
            method:metodo,
            body:JSON.stringify(company),
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
        navigate('/companies')
    }

    return(
        <FormGroup>
            <Form style={{ padding: '0px 10px' }}>
                <div>
                    <TextField id="nome" name="nome" value={company.nome} label="Nome da empresa (Limite de 100 caracteres)" variant="standard" onChange={onChangeValue} style={{ minWidth: 350, float: "left" }}  />
                    {isDesktop && ( 
                        <TextField id="cnpj"  name="cnpj" value={cnpjMask(company.cnpj)} label="CNPJ" variant="standard" onChange={onChangeValue} style={{ minWidth: 350, float: "right" }} /> 
                    )}
                    {!isDesktop && ( 
                        <TextField id="cnpj2"  name="cnpj2" value={cnpjMask(company.cnpj)} label="CNPJ" variant="standard" onChange={onChangeValue} style={{ minWidth: 350, float: "left" }} /> 
                    ) }
                </div>
                <br />
                <br />
                <div style={{ marginTop: 10 }}>
                    <FormControlLabel style={{ minWidth: "100%" }} control={<Switch onChange={onChangeValueSwitch} checked={company.ativo} value={company.ativo} name="ativo" />} label="Empresa ativa?" />
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

export default FormularioCompany;
