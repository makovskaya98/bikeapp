import React, {Component} from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Typography,
    Button,
    Unstable_Grid2 as Grid
} from '@mui/material';
import {Link, Navigate} from "react-router-dom";


class UsersTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rows: []
        };
    }


    getUsers = () => {
        return new Promise((resolve, reject) => {
            axios.get("/public/users/getusers")
                .then(function (response) {
                    if (response.data != '') {
                        resolve(response.data);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        });
    }

    getRole (id) {
        let role = '';
        switch (id) {
            case 1 :
                role = 'Администратор';
                break;
            case 2:
                role = 'Веломастер';
                break;
        }
        return role;
    }

    getActivity (id) {
        let activity = '';
        switch (id) {
            case 1 :
                activity = 'Активен';
                break;
            case 2:
                activity = 'Заблокирован';
                break;
        }
        return activity;
    }

    createData(number, id, name, login, email, role, activity) {
        return { number, id, name,login, email, role, activity };
    }

    async componentDidMount() {
        const response = await this.getUsers();
        let self = this;
        let rows = [];
        let i = 1;
        response.forEach(function (item) {
            rows.push(self.createData(i, item.id, item.name, item.login, item.email, item.role, item.activity));
            i++;
        });
        this.setState({rows: rows});
    }

    render() {

        return (
            <div className="app-container">
                <Typography
                    component={"h1"}
                    variant={"h4"}
                    sx={{borderBottom: 1, marginBottom: 2, borderColor: 'divider', color: '#145ca4', p: 2}}
                >
                    Пользователи
                </Typography>
                <Box sx={{
                    boxShadow: 1,
                    borderRadius: 2,
                    alignItems: 'center',
                    bgcolor: 'background.paper',
                    p: 2,
                }}>
                    <Grid sx={{marginBottom: 1}} container spacing={2}>
                        <Grid xs={10}></Grid>

                        <Grid xs={2}>
                            <Link to="/public/users/add"><Button variant="outlined" fullWidth><span className="btn-content"><i
                                className="bi bi-person-plus"></i> <span>Добавить</span></span></Button></Link>
                        </Grid>
                    </Grid>
                    <TableContainer component={Paper}>
                        <Table sx={{minWidth: 650}} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">№</TableCell>
                                    <TableCell align="left">Имя</TableCell>
                                    <TableCell align="left">Логин</TableCell>
                                    <TableCell align="left">Email</TableCell>
                                    <TableCell align="left">Роль</TableCell>
                                    <TableCell align="left">Активность</TableCell>
                                    <TableCell align="left"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    >
                                        <TableCell align="left">{row.number}</TableCell>
                                        <TableCell component="th" scope="row">{row.name}</TableCell>
                                        <TableCell align="left">{row.login}</TableCell>
                                        <TableCell align="left">{row.email}</TableCell>
                                        <TableCell align="left">{this.getRole(row.role)}</TableCell>
                                        <TableCell align="left">{this.getActivity(row.activity)}</TableCell>
                                        <TableCell align="left"><Link className="link-item"
                                                                      to={'/public/users/' + row.id}><i
                                            className="bi bi-pencil-square"></i></Link></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </div>
        );

    }
}

export default UsersTable;
