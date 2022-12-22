import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';


const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];


export default function AccountDashboard() {
    return (
        <div>
            <CssBaseline/>
            <Container sx={{py: 8}} maxWidth="md">
                <Grid container spacing={4}>
                    {cards.map((card) =>
                        <div key={card}></div>
                    )}
                </Grid>
            </Container>
        </div>
    );
}
