import React, { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ListIcon from '@mui/icons-material/List';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom'
import ThumbUpAltTwoToneIcon from '@mui/icons-material/ThumbUpAltTwoTone';
import ThumbDownAltTwoToneIcon from '@mui/icons-material/ThumbDownAltTwoTone';
import { cnpjMask } from '../../components/cnpjMask'
import { messages } from '../../components/messagesEnum'
import { react_constants } from '../../components/constants'
import { SnackBarAlert } from '../../components/snackBarAlert'
import { ConfirmationDialog } from '../../components/ConfirmationDialog'
import { ConfirmationDialogGeneric } from '../../components/ConfirmationDialogGeneric'

export default function TabeladeCompanies(){
    const navigate = useNavigate()
    const [companies, setCompanies] = useState([]);
    const [openToast, setOpenToast] = useState(false);
    const [type, setType] = useState("");
    const [message, setMessage] = useState("");
    const [firstArgument, setFirstArgument] = useState("");
    const [secondArgument, setSecondArgument] = useState("");
    const [removerCodigo, setRemoverCodigo] = useState(0);
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [confirmDialogDelete, setConfirmDialogDelete] = useState(false);

    const newPress = () => {
        navigate('/company/formulario')
    }

    const editPress = (e) => {
        navigate(`/company/formulario/${e}`)
    }

    const seeAllExercises = (e) => {
        navigate(`/company/see-all-employees/${e.nome}/${e.codigo}`)
    }

    const confirmationDialog = (e, ativo) => {
        const ativado = ativo === 1 ? false : true;
        if (ativado) {
            setFirstArgument("ativar")
            setSecondArgument("desativar")
        } else {
            setFirstArgument("desativar")
            setSecondArgument("ativar")
        }
        setRemoverCodigo(e)
        setConfirmDialog(true)
    }

    const confirmationCloseDialog = () => {
        setRemoverCodigo(0)
        setConfirmDialog(false)
    }

    const allCompanies = () => {
        fetch(`${react_constants["local_api"]}/empresas`)
        .then(retorno => retorno.json())
        .then(retorno_convertido => setCompanies(retorno_convertido))
    }

    const confirmationCloseDialogDelete = () => {
        setRemoverCodigo(0)
        setConfirmDialogDelete(false)
    }
    
    const deletePress = () => {
        fetch(`${react_constants["local_api"]}/empresa/desativarAtivar/${removerCodigo}`,{
            method:"put",
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
                allCompanies()
                setType("success");
                confirmationCloseDialog()
            }
            setOpenToast(true);
        })
    }

    const deleteDoNotReversePress = () => {
        fetch(`${react_constants["local_api"]}/empresa/${removerCodigo}`,{
            method:"delete",
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
                allCompanies()
                setType("success");
                confirmationCloseDialogDelete()
            }
            setOpenToast(true);
        })
    }

    const closeToast = () => {
        setOpenToast(false);
    }

    const [isDesktop, setIsDesktop] = useState(
        window.matchMedia("(min-width: 767px)").matches
    )
    
    useEffect(() => {
        window.matchMedia("(min-width: 767px)")
        .addEventListener('change', e => setIsDesktop( e.matches ));
        allCompanies()
    }, []);

    const confirmationDialogDelete = (e) => {
        setRemoverCodigo(e)
        setConfirmDialogDelete(true)
    }

    return(        
        <Form>
            <Button variant="primary" onClick={() => newPress()} style={{ margin: "10px 0px", position: "relative", float: "right" }}>
                <AddIcon sx={{ fontSize: 20 }} />
                {isDesktop && <span style={{ paddingTop: "1px" }}>&nbsp;Nova Empresa</span>}
            </Button>
            <strong style={{ fontSize: "larger" }}>Empresas</strong>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Empresa</th>
                        <th>CNPJ</th>
                        <th>Ativo</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody style={{ verticalAlign: 'middle' }}>
                    {companies.map((company, indice) => (
                        <tr key={indice}>
                            <td>{indice + 1}</td>
                            <td>{company.nome}</td>
                            <td>{cnpjMask(company.cnpj)}</td>
                            <td>{company.ativo ? "Sim" : "Não"}</td>
                            <td>
                                <ButtonGroup aria-label="">
                                    <Button variant="dark" onClick={() => {seeAllExercises(company)}}>
                                        <ListIcon sx={{ fontSize: 20 }} />
                                        {isDesktop && <span style={{ paddingTop: "1px" }}>&nbsp;Lista Funcionários</span>}
                                    </Button>
                                    <Button variant="warning" onClick={() => {editPress(company.codigo)}}>
                                        <EditIcon sx={{ fontSize: 20 }} />
                                        {isDesktop && <span style={{ paddingTop: "1px" }}>&nbsp;Editar</span>}
                                    </Button>
                                    {(company.ativo || parseInt(company.ativo) === 1) && (
                                        <Button variant="dark" onClick={() => confirmationDialog(company.codigo, company.ativo)}>
                                            <ThumbDownAltTwoToneIcon sx={{ fontSize: 20 }} />
                                            {isDesktop && <span style={{ paddingTop: "1px" }}>&nbsp;Desativar</span>}
                                        </Button>
                                    )}
                                    {(!company.ativo || parseInt(company.ativo) === 0) && (
                                        <Button variant="success" onClick={() => confirmationDialog(company.codigo, company.ativo)}>
                                            <ThumbUpAltTwoToneIcon sx={{ fontSize: 20 }} />
                                            {isDesktop && <span style={{ paddingTop: "1px" }}>&nbsp;Ativar</span>}
                                        </Button>
                                    )}
                                    <Button variant="danger" onClick={() => { confirmationDialogDelete(company.codigo); } }>
                                        <DeleteIcon sx={{ fontSize: 20 }} />
                                        {isDesktop && <span style={{ paddingTop: "1px" }}>&nbsp;Deletar</span>}
                                    </Button>
                                </ButtonGroup>
                            </td>
                        </tr>
                    ))}                    
                </tbody>
            </Table>
            <ConfirmationDialog 
                open={confirmDialog}
                firstArgument={firstArgument}
                secondArgument={secondArgument}
                confirmation={() => {deletePress()}} 
                onClose={() => {confirmationCloseDialog()}}
                title={'empresa'}
            />
            <SnackBarAlert open={openToast} type={type} message={message} handleClose={() => {closeToast()}} />
            <ConfirmationDialogGeneric
                    open={confirmDialogDelete}
                    text={"Ao deletar esta empresa, vc deletará todas as respostas, perguntas, ações, seus funcionários e a empresa, não tem como desfazer!"}
                    confirmation={() => { deleteDoNotReversePress(); } }
                    onClose={() => { confirmationCloseDialogDelete(); } }
                    title={'usuario'} />
                <SnackBarAlert open={openToast} type={type} message={message} handleClose={() => { closeToast(); } } />
        </Form>
    )
}
