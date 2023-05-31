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

export default function TabelaUsuarios(){
    const navigate = useNavigate()
    const [users, setUsers] = useState([]);
    const [openToast, setOpenToast] = useState(false);
    const [type, setType] = useState("");
    const [message, setMessage] = useState("");
    const [firstArgument, setFirstArgument] = useState("");
    const [secondArgument, setSecondArgument] = useState("");
    const [removerCodigo, setRemoverCodigo] = useState(0);
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [confirmDialogDelete, setConfirmDialogDelete] = useState(false);

    const newPress = () => {
        navigate('/users/formulario')
    }

    const editPress = (e) => {
        navigate(`/users/formulario/${e}`)
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

    const confirmationDialogDelete = (e) => {
        setRemoverCodigo(e)
        setConfirmDialogDelete(true)
    }

    const confirmationCloseDialog = () => {
        setRemoverCodigo(0)
        setConfirmDialog(false)
    }

    const confirmationCloseDialogDelete = () => {
        setRemoverCodigo(0)
        setConfirmDialogDelete(false)
    }

    const allUsers = () => {
        fetch(`${react_constants["local_api"]}/usuarios`)
        .then(retorno => retorno.json())
        .then(retorno_convertido => setUsers(retorno_convertido))
    }
    
    const deletePress = () => {
        fetch(`${react_constants["local_api"]}/usuario/desativarAtivar/${removerCodigo}`,{
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
                allUsers()
                setType("success");
                confirmationCloseDialog()
            }
            setOpenToast(true);
        })
    }

    const deleteDoNotReversePress = () => {
        fetch(`${react_constants["local_api"]}/usuario/${removerCodigo}`,{
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
                allUsers()
                setType("success");
                confirmationCloseDialogDelete()
            }
            setOpenToast(true);
        })
    }

    const closeToast = () => {
        setOpenToast(false);
    };

    const [isDesktop, setIsDesktop] = useState(
        window.matchMedia("(min-width: 767px)").matches
    )
    
    useEffect(() => {
        window.matchMedia("(min-width: 767px)")
        .addEventListener('change', e => setIsDesktop( e.matches ));
        allUsers()
    }, []);

    return(
        <Form>
            <Button variant="primary" onClick={() => newPress()} style={{ margin: "10px 0px", position: "relative", float: "right" }}>
                <AddIcon sx={{ fontSize: 20 }} />
                {isDesktop && <span style={{ paddingTop: "1px" }}>&nbsp;Novo Usuário</span>}
            </Button>
            <strong style={{ fontSize: "larger" }}>Usuários</strong>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Login</th>
                        <th>Admin?</th>
                        <th>Ativo?</th>
                        <th>Empresa</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody style={{ verticalAlign: 'middle' }}>
                    {users.map((user, indice) => (
                        <tr key={indice}>
                            <td>{indice + 1}</td>
                            <td>{user.nome}</td>
                            <td>{user.email}</td>
                            <td>{user.login}</td>
                            <td>{user.admin_system ? "Sim" : "Não"}</td>
                            <td>{user.ativo ? "Sim" : "Não"}</td>
                            <td>{user.empresa}</td>
                            <td>
                                <ButtonGroup aria-label="">
                                    <Button variant="warning" onClick={() => { editPress(user.codigo); } }>
                                        <EditIcon sx={{ fontSize: 20 }} />
                                        {isDesktop && <span style={{ paddingTop: "1px" }}>&nbsp;Editar</span>}
                                    </Button>
                                    {(user.ativo || parseInt(user.ativo) === 1) && (
                                        <Button variant="dark" onClick={() => confirmationDialog(user.codigo, user.ativo)}>
                                            <ThumbDownAltTwoToneIcon sx={{ fontSize: 20 }} />
                                            {isDesktop && <span style={{ paddingTop: "1px" }}>&nbsp;Desativar</span>}
                                        </Button>
                                    )}
                                    {(!user.ativo || parseInt(user.ativo) === 0) && (
                                        <Button variant="success" onClick={() => confirmationDialog(user.codigo, user.ativo)}>
                                            <ThumbUpAltTwoToneIcon sx={{ fontSize: 20 }} />
                                            {isDesktop && <span style={{ paddingTop: "1px" }}>&nbsp;Ativar</span>}
                                        </Button>
                                    )}
                                    <Button variant="danger" onClick={() => { confirmationDialogDelete(user.codigo); } }>
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
                confirmation={() => { deletePress(); } }
                onClose={() => { confirmationCloseDialog(); } }
                title={'usuario'} />
            <SnackBarAlert open={openToast} type={type} message={message} handleClose={() => { closeToast(); } } />
            <ConfirmationDialogGeneric
                open={confirmDialogDelete}
                text={"Ao deletar este usuário, irá deletar todas as respostas que este usuário respondeu e não tem como desfazer!"}
                confirmation={() => { deleteDoNotReversePress(); } }
                onClose={() => { confirmationCloseDialogDelete(); } }
                title={'usuario'} />
            <SnackBarAlert open={openToast} type={type} message={message} handleClose={() => { closeToast(); } } />
        </Form>
    )
}
