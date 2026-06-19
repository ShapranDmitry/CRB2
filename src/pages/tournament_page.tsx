import { useTournamentContext } from '../logic';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
export default function Tournament_page(){
    const {findTournamet} = useTournamentContext()
    const {id} = useParams()
    if (!id) {
        return <div>Неверный идентификатор турнира</div>;
    }
    const tournamentId = Number(id);
    const thisTournament = findTournamet(tournamentId)
    return(
        <>
            <h1>Страница турнира {thisTournament.tournamentName}</h1>
            <h2>Описание {thisTournament?.tournamentDescription}</h2>
            <h2>Статус {thisTournament?.status? "Идет": "Остановлен"}</h2>
            <h2>Список участников данного турнира</h2>
            {thisTournament?.tournamentParticipants.map((p)=> (
                <div key={p.id}>{p.id}:  {p.name}</div>
            ))}
       {thisTournament.status&& (
        <div>
          <Link to = {`/tournaments/${id}/grid`}>
          <button>
            Турнирная сетка
          </button>
          </Link>
        </div>
      )}
      
    </>
  );
}