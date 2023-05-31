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
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import "../styles.css"

const userDefault = {
    codigo: 0,
    nome: "",
    email: "",
    login: "",
    senha: "",
    admin_system: false,
    ativo: true
}

const companyDefault = {
    codigo: 0,
    nome: "",
    cnpj: "",
    ativo: true
}

function Formulario(){
    const navigate = useNavigate();
    const { id } = useParams();
    const [user, setUser] = useState(userDefault);
    const [companies, setCompanies] = useState([companyDefault]);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [type, setType] = useState("");
    const [adminSystem, setAdminSystem] = useState(false);
    const [declaredCompany, setDeclaredCompany] = useState(0);
    
    const [isDesktop, setIsDesktop] = useState(
        window.matchMedia("(min-width: 767px)").matches
    )

    const admin = localStorage.getItem("admin_system");
    
    useEffect(() => {
        window
        .matchMedia("(min-width: 767px)")
        .addEventListener('change', e => setIsDesktop( e.matches ));

        if (id !== undefined && id !== null) {
            fetch(`${react_constants["local_api"]}/usuario/${id}`)
                .then(retorno => retorno.json())
                .then(retorno_convertido => {
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                    setDeclaredCompany(retorno_convertido[0].codigo_empresa)
                    setUser(retorno_convertido[0])
                })
        }

        fetch(`${react_constants["local_api"]}/empresas/ativas`)
            .then(retorno => retorno.json())
            .then(retorno_convertido => setCompanies(retorno_convertido))
        
        setAdminSystem(parseInt(admin) === 1 ? true : false)
    }, [admin, id]);

    const onChangeValue = (e) => {
        setUser({...user, [e.target.name]:e.target.value})
    }

    const onChangeValueSwitch = (e) => {
        setUser({...user, [e.target.name]:e.target.checked})
    }

    const handleClose = () => {
        setOpen(false);
    };
    
    const handleSubmit = () => {
        let rota = "usuario";
        let metodo = "";

        if (id !== undefined && id !== null && id !== 0) {
            metodo = "put";
            rota = rota+`/${id}`
        } else {
            metodo = "post";
        }

        fetch(`${react_constants["local_api"]}/${rota}`,{
            method:metodo,
            body:JSON.stringify(user),
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
        if(adminSystem === true)
            navigate('/users')
        else
            navigate('/home')
    }

    const handleChange = (event) => {
        setDeclaredCompany(event.target.value);
        setUser({...user, codigo_empresa:event.target.value});
    };

    return(
        <FormGroup>
            <Form style={{ padding: '0px 10px' }}>
                <div>
                    <TextField id="nome" name="nome" value={user.nome} label="Nome do usuário (Limite de 100 caracteres)" variant="standard" onChange={onChangeValue} style={{ minWidth: 350, float: "left" }}  />
                    {isDesktop && ( 
                        <TextField id="email"  name="email" value={user.email} label="Email do usuário (Limite de 100 caracteres)" variant="standard" onChange={onChangeValue} style={{ minWidth: 350, float: "right" }} /> 
                    )}
                    {!isDesktop && ( 
                        <TextField id="email2"  name="email" value={user.email} label="Email do usuário (Limite de 100 caracteres)" variant="standard" onChange={onChangeValue} style={{ minWidth: 350, float: "left" }} /> 
                    ) }
                </div>
                <br />
                <br />
                <div>
                    <TextField name="login" value={user.login} id="login" label="Login (Limite de 50 caracteres)" variant="standard" onChange={onChangeValue} style={{ minWidth: 350, float: "left" }} />
                    {isDesktop && ( <TextField name="senha" value={user.senha} id="password" label="Senha (Limite de 50 caracteres)" variant="standard" onChange={onChangeValue} style={{ minWidth: 350, float: "right" }} /> )}
                    {!isDesktop && ( <TextField name="senha" value={user.senha} id="password2" label="Senha (Limite de 50 caracteres)" variant="standard" onChange={onChangeValue} style={{ minWidth: 350, float: "left", marginBottom: 10 }} /> ) }
                </div>
                {adminSystem === true && (
                    <div style={{ marginTop: 30 }}>
                        <FormControlLabel style={{ minWidth: "100%" }} control={<Switch onChange={onChangeValueSwitch} checked={user.admin_system} value={user.admin_system} name="admin_system" />} label="Usuário é admin do sistema?" />
                        <FormControlLabel style={{ minWidth: "100%" }} control={<Switch onChange={onChangeValueSwitch} checked={user.ativo} value={user.ativo} name="ativo" />} label="Usuário ativo?" />
                    </div>
                )}
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
                <br />
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

export default Formulario;
