import Container from '../component/ui/Container'
import Title from '../component/ui/Title'
import DashboardSolde from '../component/DashboardSolde'
import DashboardRecette from '../component/DashboardRecette'
import useSWR from "swr";
import { GETfetcher } from "../constants/fetcher";
import InputField from '../component/ui/InputField';
import { useState } from 'react';
import getDaysBetween from '../constants/days';

function DashboardPage() {

    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()

    const { data: accounts, isLoading } = useSWR(
        "http://127.0.0.1:8000/api/my-accounts",
        GETfetcher
    );

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!accounts) {
        return <div>No account data available</div>;
    }

    const datesList = startDate < endDate ? getDaysBetween(new Date(startDate), new Date(endDate)) : [];

    return (
        <Container style="h-screen overflow-auto">
            <Title>Page de Dashboard</Title>
            <div className='flex flex-col gap-5'>
                <div className='flex gap-5' >
                    <InputField
                        label='Start date'
                        type='date'
                        name='startDate'
                        value={startDate}
                        onChange={(e) => { setStartDate(e.target.value) }}
                    />
                    <InputField
                        label='End date'
                        type='date'
                        name='endDate'
                        value={endDate}
                        onChange={(e) => { setEndDate(e.target.value) }}
                    />
                </div>
                {startDate < endDate && <>
                    <DashboardSolde accounts={accounts} datesList={datesList} />
                    <DashboardRecette accounts={accounts} datesList={datesList} />

                </>}
            </div>
        </Container>
    )
}

export default DashboardPage