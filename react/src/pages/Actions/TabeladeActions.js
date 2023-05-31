import React, { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom'
import ThumbUpAltTwoToneIcon from '@mui/icons-material/ThumbUpAltTwoTone';
import ThumbDownAltTwoToneIcon from '@mui/icons-material/ThumbDownAltTwoTone';
import { messages } from '../../components/messagesEnum'
import { react_constants } from '../../components/constants'
import { SnackBarAlert } from '../../components/snackBarAlert'
import { ConfirmationDialog } from '../../components/ConfirmationDialog'
import { ConfirmationDialogGeneric } from '../../components/ConfirmationDialogGeneric'

export default function TabelaActions(){
    const navigate = useNavigate()
    const [actions, setActions] = useState([]);
    const [openToast, setOpenToast] = useState(false);
    const [type, setType] = useState("");
    const [message, setMessage] = useState("");
    const [firstArgument, setFirstArgument] = useState("");
    const [secondArgument, setSecondArgument] = useState("");
    const [removerCodigo, setRemoverCodigo] = useState(0);
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [confirmDialogDelete, setConfirmDialogDelete] = useState(false);

    const newPress = () => {
        navigate('/action/formulario')
    }

    const editPress = (e) => {
        navigate(`/action/formulario/${e}`)
    }

    const confirmationDialog = (e, ativo) => {
        if (ativo) {
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

    const allActions = () => {
        fetch(`${react_constants["local_api"]}/acao`)
            .then(retorno => retorno.json())
            .then(retorno_convertido => (
                // console.log(retorno_convertido)
                setActions(retorno_convertido))
            )
    }
    
    const deletePress = () => {
        fetch(`${react_constants["local_api"]}/acao/desativarAtivar/${removerCodigo}`,{
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
                allActions()
                setType("success");
                confirmationCloseDialog()
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
        allActions()
    }, []);

    const confirmationDialogDelete = (e) => {
        setRemoverCodigo(e)
        setConfirmDialogDelete(true)
    }

    const confirmationCloseDialogDelete = () => {
        setRemoverCodigo(0)
        setConfirmDialogDelete(false)
    }

    const deleteDoNotReversePress = () => {
        fetch(`${react_constants["local_api"]}/acao/${removerCodigo}`,{
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
                allActions()
                setType("success");
                confirmationCloseDialogDelete()
            }
            setOpenToast(true);
        })
    }

    const DateFormat = (e) => {
        let data = new Date(e);
        return ((data.getDate() )) + "/" + ((data.getMonth() + 1)) + "/" + data.getFullYear();
    }

    return(        
        <Form>
            <Button variant="primary" onClick={() => newPress()} style={{ margin: "10px 0px", position: "relative", float: "right" }}>
                <AddIcon sx={{ fontSize: 20 }} />
                {isDesktop && <span style={{ paddingTop: "1px" }}>&nbsp;Nova Ação</span>}
            </Button>
            <strong style={{ fontSize: "larger" }}>Ações</strong>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Empresa</th>
                        <th>Título</th>
                        <th>Descrição</th>
                        <th>Data Inicial</th>
                        <th>Data Final</th>
                        <th>Ativo?</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody style={{ verticalAlign: 'middle' }}>
                    {actions.map((action, indice) => (
                        <tr key={indice}>
                            <td>{indice + 1}</td>
                            <td>{action.empresa}</td>
                            <td>{action.title}</td>
                            <td>{action.descricao}</td>
                            <td>{DateFormat(action.prazo_inicial)}</td>
                            <td>{DateFormat(action.prazo_final)}</td>
                            <td>{action.ativo ? "Sim" : "Não"}</td>
                            <td>
                                <ButtonGroup aria-label="">
                                    <Button variant="warning" onClick={() => {editPress(action.codigo)}}>
                                        <EditIcon sx={{ fontSize: 20 }} />
                                        {isDesktop && <span style={{ paddingTop: "1px" }}>&nbsp;Editar</span>}
                                    </Button>
                                    {(action.ativo || parseInt(action.ativo) === 1) && (
                                        <Button variant="dark" onClick={() => confirmationDialog(action.codigo, action.ativo)}>
                                            <ThumbDownAltTwoToneIcon sx={{ fontSize: 20 }} />
                                            {isDesktop && <span style={{ paddingTop: "1px" }}>&nbsp;Desativar</span>}
                                        </Button>
                                    )}
                                    {(!action.ativo || parseInt(action.ativo) === 0) && (
                                        <Button variant="success" onClick={() => confirmationDialog(action.codigo, action.ativo)}>
                                            <ThumbUpAltTwoToneIcon sx={{ fontSize: 20 }} />
                                            {isDesktop && <span style={{ paddingTop: "1px" }}>&nbsp;Ativar</span>}
                                        </Button>
                                    )}
                                    <Button variant="danger" onClick={() => { confirmationDialogDelete(action.codigo); } }>
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
                title={'ação'}
            />
            <SnackBarAlert open={openToast} type={type} message={message} handleClose={() => {closeToast()}} />
            <ConfirmationDialogGeneric
                open={confirmDialogDelete}
                text={"Ao deletar esta ação, irá deletar todas as respostas vinculadas a esta ação e não tem como desfazer!"}
                confirmation={() => { deleteDoNotReversePress(); } }
                onClose={() => { confirmationCloseDialogDelete(); } }
                title={'ação'} />
            <SnackBarAlert open={openToast} type={type} message={message} handleClose={() => { closeToast(); } } />
        </Form>
    )
}
