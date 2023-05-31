import React, { useState, useEffect } from 'react'
import { react_constants } from '../components/constants'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import './styles.css'
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom'

export default function Home(){
    const [actions, setActions] = useState([]);
    const navigate = useNavigate()

    const handleResponse = (acaoId) => {
        navigate('/questions/allquestions/' + acaoId)
    }

    useEffect(() => {
        fetch(`${react_constants["local_api"]}/acoes/vigentes/${localStorage.getItem("codigo")}`,{
            method:"get",
            headers:{
                'Content-type':'application/json',
                'Accept':'application/json'
            }
        })
        .then(retorno => retorno.json())
        .then(retorno_convertido => setActions(retorno_convertido))
    }, [])

    const formatDate = (data) => {
        let newData = new Date(data);
        return ((newData.getDate() < 10) ? '0' + (newData.getDate()) : (newData.getDate())) + "/" + ((newData.getMonth() + 1 < 10) ? '0' + (newData.getMonth() + 1) : (newData.getMonth() + 1)) + "/" + newData.getFullYear()
    }

    return (
        <Form>
            {Array.isArray(actions) && actions.map((action, indice) => (
                <Card id={action.title + indice} key={action.title + indice} sx={{ minWidth: 275 }} style={{ backgroundColor: 'ghostwhite' }}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            {action.title}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            {action.descricao}
                        </Typography>
                        <Typography variant="body2">
                            De: {formatDate(action.prazo_inicial)}
                            <br />
                            Até: {formatDate(action.prazo_final)}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" onClick={() => handleResponse(action.codigo)}>RESPONDER</Button>
                    </CardActions>
                </Card>
            ))}
        </Form>
    )
}
