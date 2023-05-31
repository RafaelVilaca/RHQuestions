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

const actionDefault = {
    codigo: 0,
    title: "",
    descricao: "",
    prazo_inicial: new Date(),
    prazo_final: new Date(),
    codigo_empresa: null,
    ativo: true
}

function FormularioActions(){
    const navigate = useNavigate();
    const { id } = useParams();
    const [action, setAction] = useState(actionDefault);
    const [companies, setCompanies] = useState([]);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [type, setType] = useState("");
    const [declaredCompany, setDeclaredCompany] = useState(0);
    // const theme = useTheme();

    const [isDesktop, setIsDesktop] = useState(
        window.matchMedia("(min-width: 767px)").matches
    )

    useEffect(() => {
        window
        .matchMedia("(min-width: 767px)")
        .addEventListener('change', e => setIsDesktop( e.matches ));

        if (id !== undefined && id !== null) {
            fetch(`${react_constants["local_api"]}/acao/${id}`)
                .then(retorno => retorno.json())
                .then(retorno_convertido => {
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                    setDeclaredCompany(retorno_convertido[0].codigo_empresa)
                    setAction(retorno_convertido[0])
                })
        }

        fetch(`${react_constants["local_api"]}/empresas/ativas`)
            .then(retorno => retorno.json())
            .then(retorno_convertido => (
                setCompanies(retorno_convertido)
            ))
    }, [id]);

    const onChangeValue = (e) => {
        setAction({...action, [e.target.name]:e.target.value})
    }

    const onChangeValueSwitch = (e) => {
        setAction({...action, [e.target.name]:e.target.checked})
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event) => {
        setDeclaredCompany(event.target.value);
        setAction({...action, codigo_empresa:event.target.value});
    };
    
    const handleSubmit = () => {
        let rota = "acao";
        let metodo = "";
        if (id !== undefined && id !== null && id !== 0) {
            metodo = "put";
            rota = rota+`/${id}`
        } else {
            metodo = "post";
        }
        fetch(`${react_constants["local_api"]}/${rota}`,{
            method:metodo,
            body:JSON.stringify(action),
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
        navigate('/actions')
    }

    const DateFormat = (e) => {
        let data = new Date(e);
        return data.getFullYear() + "-" + ((data.getMonth() + 1 < 10) ? '0' + (data.getMonth() + 1) : (data.getMonth() + 1)) + "-" + ((data.getDate() < 10) ? '0' + (data.getDate()) : (data.getDate()));
    }

    return(
        <FormGroup>
            <Form style={{ padding: '0px 10px' }}>
                <div>
                    <TextField id="title" name="title" value={action.title} label="Título (Limite de 100 caracteres)" variant="standard" onChange={onChangeValue} style={{ minWidth: 350, float: "left" }}  />
                    {isDesktop && ( 
                        // eslint-disable-next-line no-undef
                        <TextField id="descricao" multiline maxRows={3} name="descricao" value={action.descricao} label="Descrição (Limite de 300 caracteres)" variant="standard" onChange={onChangeValue} style={{ minWidth: 350, float: "right" }} /> 
                    )}
                    {!isDesktop && ( 
                        <TextField id="descricao2" multiline maxRows={3} name="descricao" value={action.descricao} label="Descrição  (Limite de 300 caracteres)" variant="standard" onChange={onChangeValue} style={{ minWidth: 350, float: "left" }} /> 
                    ) }
                </div>
                <br />
                <br />
                <br />
                <div>
                    <TextField type="date" id="prazo_inicial" name="prazo_inicial" value={DateFormat(action.prazo_inicial)} label="Prazo Inicial" variant="standard" onChange={onChangeValue} style={{ minWidth: 350, float: "left" }}  />
                    {isDesktop && ( 
                        <TextField type="date" id="prazo_final" name="prazo_final" value={DateFormat(action.prazo_final)} label="Prazo Final" variant="standard" onChange={onChangeValue} style={{ minWidth: 350, float: "right" }} /> 
                    )}
                    {!isDesktop && ( 
                        <TextField type="date" id="prazo_final2" name="prazo_final" value={DateFormat(action.prazo_final)} label="Prazo Final" variant="standard" onChange={onChangeValue} style={{ minWidth: 350, float: "left" }} /> 
                    ) }
                </div>
                <br />
                <br />
                <br />
                <div>
                    <FormControl variant="outlined" sx={{ m: 1, width: 300 }}>
                        <InputLabel id="demo-mutiple-name-label">Empresa Relacionada</InputLabel>
                        <Select
                            labelId="demo-multiple-name-label"
                            id="demo-multiple-name"
                            value={declaredCompany}
                            onChange={handleChange}
                            input={<OutlinedInput label="Empresa Relacionada" />}
                        >
                        {companies.map((company,indice) => (
                            <MenuItem
                                key={company + indice}
                                name={company.nome}
                                value={company.codigo}
                            >
                                {company.nome}
                            </MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                </div>
                <div style={{ marginTop: 10 }}>
                    <FormControlLabel style={{ minWidth: "100%" }} control={<Switch onChange={onChangeValueSwitch} checked={action.ativo} value={action.ativo} name="ativo" />} label="Ação ativa?" />
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

export default FormularioActions;
