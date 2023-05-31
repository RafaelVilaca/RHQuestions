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
import "../styles.css";

function TodosFuncionariosEmpresa(){
    const navigate = useNavigate();
    const { empresa, id } = useParams();
    const [employeesOfCompany, setEmployeesOfCompany] = useState([]);
    const [message, setMessage] = useState("");
    const [type, setType] = useState("");
    const [firstArgument, setFirstArgument] = useState("");
    const [secondArgument, setSecondArgument] = useState("");
    const [removerCodigo, setRemoverCodigo] = useState(0);
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [openToast, setOpenToast] = useState(false);
    
    const [isDesktop, setIsDesktop] = useState(
        window.matchMedia("(min-width: 767px)").matches
    )

    const allExercises = () => {
        fetch(`${react_constants["local_api"]}/see-all-employees-of-company/${id}`)
        .then(retorno => retorno.json())
        .then(retorno_convertido => setEmployeesOfCompany(retorno_convertido))
    }
    
    useEffect(() => {
        window.matchMedia("(min-width: 767px)")
        .addEventListener('change', e => setIsDesktop( e.matches ));
        allExercises();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleBack = () => {
        navigate('/companies')
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
                allExercises()
                setType("success");
                confirmationCloseDialog()
            }
            setOpenToast(true);
        })
    }

    const closeToast = () => {
        setOpenToast(false);
    }

    return(
        <Form>
            <strong style={{ fontSize: "larger" }}>{empresa}</strong>
            <Button variant="danger" onClick={handleBack} style={{ margin: "10px 0px", position: "relative", float: "right" }}>
                <ArrowBackIcon sx={{ fontSize: 20 }} />
                {isDesktop && <span style={{ paddingTop: "1px" }}>&nbsp;Voltar</span>}
            </Button>
            {/* <><p>{JSON.stringify(trainings)}</p></> */}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Login</th>
                        <th>Admin?</th>
                        <th>Ativo?</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody style={{ verticalAlign: 'middle' }}>
                    {employeesOfCompany.map((employee, indice) => (
                        <tr key={indice}>
                            <td>{indice + 1}</td>
                            <td>{employee.nome}</td>
                            <td>{employee.email}</td>
                            <td>{employee.login}</td>
                            <td>{employee.admin_system ? "Sim" : "Não"}</td>
                            <td>{employee.ativo ? "Sim" : "Não"}</td>
                            <td>
                                <ButtonGroup aria-label="">
                                    {(employee.ativo || parseInt(employee.ativo) === 1) && (
                                        <Button variant="danger" onClick={() => confirmationDialog(employee.codigo, employee.ativo)}>
                                            <ThumbDownAltTwoToneIcon sx={{ fontSize: 20 }} />
                                            {isDesktop && <span style={{ paddingTop: "1px" }}>&nbsp;Desativar</span>}
                                        </Button>
                                    )}
                                    {(!employee.ativo || parseInt(employee.ativo) === 0) && (
                                        <Button variant="success" onClick={() => confirmationDialog(employee.codigo, employee.ativo)}>
                                            <ThumbUpAltTwoToneIcon sx={{ fontSize: 20 }} />
                                            {isDesktop && <span style={{ paddingTop: "1px" }}>&nbsp;Ativar</span>}
                                        </Button>
                                    )}
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
                title={'usuário'}
            />
            <SnackBarAlert open={openToast} type={type} message={message} handleClose={() => {closeToast()}} />  
        </Form>
    )
}

export default TodosFuncionariosEmpresa;
