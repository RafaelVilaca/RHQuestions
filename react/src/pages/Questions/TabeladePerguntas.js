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

export default function TabeladePerguntas(){
    const navigate = useNavigate()
    const [questions, setQuestions] = useState([]);
    const [openToast, setOpenToast] = useState(false);
    const [type, setType] = useState("");
    const [message, setMessage] = useState("");
    const [firstArgument, setFirstArgument] = useState("");
    const [secondArgument, setSecondArgument] = useState("");
    const [removerCodigo, setRemoverCodigo] = useState(0);
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [confirmDialogDelete, setConfirmDialogDelete] = useState(false);

    const newPress = () => {
        navigate('/question/formulario')
    }

    const editPress = (e) => {
        navigate(`/question/formulario/${e}`)
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

    const allQuestions = () => {
        fetch(`${react_constants["local_api"]}/perguntas`)
        .then(retorno => retorno.json())
        .then(retorno_convertido => setQuestions(retorno_convertido))
    }

    const confirmationCloseDialogDelete = () => {
        setRemoverCodigo(0)
        setConfirmDialogDelete(false)
    }
    
    const deletePress = () => {
        fetch(`${react_constants["local_api"]}/pergunta/desativarAtivar/${removerCodigo}`,{
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
                allQuestions()
                setType("success");
                confirmationCloseDialog()
            }
            setOpenToast(true);
        })
    }

    const deleteDoNotReversePress = () => {
        fetch(`${react_constants["local_api"]}/pergunta/${removerCodigo}`,{
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
                allQuestions()
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
        allQuestions()
    }, []);

    const confirmationDialogDelete = (e) => {
        setRemoverCodigo(e)
        setConfirmDialogDelete(true)
    }

    return(        
        <Form>
            <Button variant="primary" onClick={() => newPress()} style={{ margin: "10px 0px", position: "relative", float: "right" }}>
                <AddIcon sx={{ fontSize: 20 }} />
                {isDesktop && <span style={{ paddingTop: "1px" }}>&nbsp;Nova Pergunta</span>}
            </Button>
            <strong style={{ fontSize: "larger" }}>Perguntas</strong>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Ação</th>
                        <th>Pergunta</th>
                        <th>Ativo</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody style={{ verticalAlign: 'middle' }}>
                    {questions.map((question, indice) => (
                        <tr key={indice}>
                            <td>{indice + 1}</td>
                            <td>{question.acao}</td>
                            <td>{question.descricao}</td>
                            <td>{question.ativo ? "Sim" : "Não"}</td>
                            <td>
                                <ButtonGroup aria-label="">
                                    <Button variant="warning" onClick={() => {editPress(question.codigo)}}>
                                        <EditIcon sx={{ fontSize: 20 }} />
                                        {isDesktop && <span style={{ paddingTop: "1px" }}>&nbsp;Editar</span>}
                                    </Button>
                                    {(question.ativo || parseInt(question.ativo) === 1) && (
                                        <Button variant="dark" onClick={() => confirmationDialog(question.codigo, question.ativo)}>
                                            <ThumbDownAltTwoToneIcon sx={{ fontSize: 20 }} />
                                            {isDesktop && <span style={{ paddingTop: "1px" }}>&nbsp;Desativar</span>}
                                        </Button>
                                    )}
                                    {(!question.ativo || parseInt(question.ativo) === 0) && (
                                        <Button variant="success" onClick={() => confirmationDialog(question.codigo, question.ativo)}>
                                            <ThumbUpAltTwoToneIcon sx={{ fontSize: 20 }} />
                                            {isDesktop && <span style={{ paddingTop: "1px" }}>&nbsp;Ativar</span>}
                                        </Button>
                                    )}
                                    <Button variant="danger" onClick={() => { confirmationDialogDelete(question.codigo); } }>
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
                title={'pergunta'}
            />
            <SnackBarAlert open={openToast} type={type} message={message} handleClose={() => {closeToast()}} />
            <ConfirmationDialogGeneric
                open={confirmDialogDelete}
                text={"Ao deletar esta pergunta, vc deletará todas as respostas e a pergunta, não tem como desfazer!"}
                confirmation={() => { deleteDoNotReversePress(); } }
                onClose={() => { confirmationCloseDialogDelete(); } }
                title={'pergunta'} />
                <SnackBarAlert open={openToast} type={type} message={message} handleClose={() => { closeToast(); } } />
        </Form>
    )
}
