
import { useTournamentContext } from '../logic';
export default function Create_page(){
const {tour_name,
    setTour_name,
    description,
    setDescription,
    participants,
   
    addParticipant,
    removeParticipant,
    updateParticipant,
    saveAndStart,
    } = useTournamentContext()
    return(
        <>
            <h1>Тут вы можете создать свой турнир</h1>
            <h2>Заполните все поля</h2>
            <div>
                <h3>Введите название турнира</h3>
                <input 
                value={tour_name} 
                onChange={e => { setTour_name(e.target.value)}}
                placeholder='Название'
                >
                </input>
            </div>
                <h3>Введите описание турнира</h3>
                <input 
                
                value={description} 
                onChange={e => { setDescription(e.target.value)}}
                placeholder='Описание'
                >
                </input>
            <h3>Участники</h3>
        
            {participants.map((participant, index) => (
            <div key={participant.id}>
                <input
                    size={20}
                    value={participant.name}
                    onChange={(e) => updateParticipant(participant.id, e.target.value)}
                    placeholder={`Участник ${index + 1}`}
                >
                </input>
                {participants.length > 1 && (
                    <button 
                    onClick={() => removeParticipant(participant.id)}
                    style={{ color: 'red' }}
                    >
                    Удалить
                    </button>
                )}
            </div>
        ))}
        
        <button 
            onClick={addParticipant}
          
            style={{ 
            marginTop: '10px',
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
          
            }}
        >
            + Добавить участника
        </button>
        
        <button 
            onClick={()=>(saveAndStart())}
            type="button"
            style={{ 
            marginTop: '20px',
            padding: '8px 16px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
            }}
        >
            Сохранить
        </button>
        </>   
        )}   

