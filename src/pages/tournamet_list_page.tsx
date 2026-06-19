import { useTournamentContext } from '../logic';

import { Link } from 'react-router-dom';

export default function TournamentList_page() {
const {tournamentList} = useTournamentContext()
    return(
        tournamentList.length > 0 ?
        tournamentList.map((t)=>(
            <div key={t.index}>
                <h1>Название турнира:{t.tournamentName}</h1>
                <h2>Описание: {t.tournamentDescription}</h2>
                <h2>Статус: {t.status? 'Идет':'Остановлен'}</h2>
                    <Link to={`/tournaments/${t.index}`}>Перейти к турниру</Link>
                    
            </div>
        )):
        <h1>Список турниров пуст. Сперва создайте новый</h1>
    )
}