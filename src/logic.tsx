import { useState } from "react"
import { createContext, useContext } from 'react';
import { motion,  } from 'framer-motion';
export  interface Tournaments {
  index: number
  tournamentName: string
  tournamentDescription: string
  status: boolean
  tournamentParticipants: Participant[]
  mathes: Match[]
}
export interface Participant{
  id: number
  name: string
}
export interface Match {
  indexInRound: number
  id: number
  round:number
  gridType: 'upper'| 'down' | 'final'
  buyPass: boolean
  participantA: Participant|null
  participantB: Participant|null
  AScore: number|null
  BScore: number|null
  winer: Participant |null
  loser: Participant|null
  completed: boolean
}
const useTournament = () => {
  const nullPartisipant = {id: -1, name: "Пока не определен"}
  const [tour_name, setTour_name]=useState<string>("")
  const [description, setDescription]=useState<string>("")
  const [status,setStatus] = useState<boolean>(true)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [tournamentList, setTournamentList] = useState<Tournaments[]>(
    [{index: 1,
    tournamentName: 'Test',
    tournamentDescription: 'Test',
    status: true,
    tournamentParticipants: [{id: 1, name: "ЩЩЩЩЩЩЩЩЩЩЩЩЩЩЩ"},{id: 2, name: "Шапран Дмитрий"},{id: 3, name: "Альтман Евгений Анатольевич"},{id: 4, name: "4"},{id: 5, name: "5"},{id: 6, name: "6"},{id: 7, name: "7"},{id: 8, name: "9"}],
    mathes:[]},
    {index: 2,
    tournamentName: 'Test buy 3',
    tournamentDescription: 'Test',
    status: true,
    tournamentParticipants: [{id: 1, name: "1"},{id: 2, name: "2"},{id: 3, name: "3"}],
    mathes:[]},
    {index: 3,
    tournamentName: 'Test buy 5',
    tournamentDescription: 'Test',
    status: true,
    tournamentParticipants: [{id: 1, name: "1"},{id: 2, name: "2"},{id: 3, name: "3"},{id: 4, name: "4"},{id: 5, name: "5"},],
    mathes:[]}
  ]
  );
  const addParticipant = () => {//Вспомагательная функция для добавления нового участника
    const newId = participants.length > 0 ? 
      participants.length + 1 
      : 1;
    setParticipants([...participants, { id: newId, name: ``}]);
  };



  const removeParticipant = (id: number) => {//Вспомогательная функция для удаления участника
    if (participants.length > 1) {
      setParticipants(participants.filter(p => p.id !== id));
    }
  };



  const updateParticipant = (id: number, value: string) => {//Вспомогательная функция для изменения параметров участника
    setParticipants(participants.map(p => 
      p.id === id ? { ...p, name: value } : p
    ));
    };



  const saveAndStart = () => {//Функция вызываемая для сохранения турнира
    if (!tour_name||!description||participants.length <2) {//Проверяем поля
      alert("Заполните поля и внесите как минимум 2 участников участников"); 
      return
    }
    const participantsWithName = participants.map(p=>(
      p.name.trim() ===""?//Если участнику не задали имя вручную
      { ...p, name: `Участник ${p.id}` }//То задаем его 
      :p
    ))
    const newTournamentId = tournamentList.length > 0 ? //Назначаем id турниру
      tournamentList.length + 1 //Если турниры уже были то следующий id
      :1;//Иначе 1
    const newTournametn: Tournaments = {//Создаем новый турнир
      index: newTournamentId,
      tournamentName: tour_name,
      tournamentDescription: description,
      status: status,
      tournamentParticipants: participantsWithName,
      mathes: [],
    }
    setTournamentList([...tournamentList, newTournametn])//Добавляем его
  }



  const findTournamet = (id:number) =>{//Вспомогательная функция для нахождения турнира
    const tournament = tournamentList.find(t => t.index === Number(id))
      if (!tournament){throw new Error(`Турнир с id=${id} не найден`)}
        return(tournament)
  }
  const stopTournament = (id: number)=>{
    const tournament = findTournamet(id)
    if (tournament.status){
      setTournamentList(prev => prev.map(p=> p.index === id? {...p,status:false}: p))
    }
  }
  const updateTournament = (id: number, updatedData: Partial<Tournaments>) => {
    setTournamentList(prev => 
      prev.map(t => t.index === id ? { ...t, ...updatedData } : t)
    );
  };


  //Вспомогательная функция для создания матчей
  const generateMatch = (index: number,id: number, round:number, gridType: "upper" | 'down' | 'final', buyPass:boolean, participantA: Participant| null,participantB: Participant| null,)=> {
    const newMatch: Match = {
      indexInRound: index,
      id: id,
      round: round,
      gridType: gridType,
      buyPass: buyPass,
      participantA: participantA,
      participantB: participantB,
      AScore: null,
      BScore: null,
      winer: null,
      loser: null,
      completed: false
    }
    if (buyPass){//Если матч бай то сразу определить победителя и выставить счет
      newMatch.winer=participantA//т.к. начинаем заполнять участников с позиции А, то победитель всегда находится тут
      newMatch.completed = true//Матч завершен
      newMatch.AScore = 5
      newMatch.BScore = 0
    }
    return(newMatch)//Вернуть матч
  }



  const createGrid = (tournament: Tournaments) => {
    let currentRound = 1;//Переменная отвечающая за текущий создаваемый раунд
    let matchesInRoundDown = 0;//Переменная отвечающая за то, сколько матчей нужно создать в нижней сетке
    let matches: Match[] = [];//Массив созданых матчей
    let matchId = 1//Номер матча для отображения на странице
    const powerOfTwo = Math.ceil(Math.log2(tournament.tournamentParticipants.length))//Ближайшая степень двойки для определения матчей-баев
    let needBuyFirstRound = 2 ** powerOfTwo - tournament.tournamentParticipants.length//Сколько нужно создать баев
    let matchesInRoundUpper =  needBuyFirstRound + (tournament.tournamentParticipants.length - needBuyFirstRound)/2//Сколько матчей в верхней сетке
    let parsipiantIndex = 0//Индекс участника для распределения по играм
    while (matchesInRoundUpper >= 1 || matchesInRoundDown >= 1) {//В какой то из сеток нужно создать матч
      let newMatch: Match//Переменная под новый матч
      if (matchesInRoundUpper >= 1) {//Матч долже быть в верхней сетке
        for (let i = 0; i < matchesInRoundUpper; i++){//Выполняем пока не создадим нужное кол-во матчей
          if (currentRound !== 1){//Если раунд не первый то участники пока не известны
            newMatch = generateMatch(
              i, 
              matchId, 
              currentRound,
              "upper", 
              false, 
              nullPartisipant, 
              nullPartisipant);
          }
          else if (matchId<=needBuyFirstRound){//Если раунд первый, то сперва создадим матчи баи
            newMatch = generateMatch(
              i,
              matchId,
              currentRound,
              "upper",
              true,
              tournament.tournamentParticipants[parsipiantIndex],
              {id: -i, name: "buy"}
            )
            parsipiantIndex++//Переходим к следующему участнику
            }
          else {//Когда баи созданы, создаем оставшиеся обычные матчи
              newMatch = generateMatch(
                i,
                matchId,
                currentRound,
                "upper",
                false,
                tournament.tournamentParticipants[parsipiantIndex],
                tournament.tournamentParticipants[parsipiantIndex+1]
              )
            parsipiantIndex+=2//
            }
            matches.push(newMatch);//Добавляем новый матч в массив
            matchId+=1//Переходим к следующему матчу
        } 
      }     
      if (matchesInRoundDown > 0) {//Если матчи нужны в нижней сетке
        for (let j = 0; j < matchesInRoundDown; j++) {//Выполняем пока не создадим нужное кол-во матчей
          const newMatch = generateMatch(
            j,
            matchId, 
            currentRound, 
            "down",
            false, 
            nullPartisipant, 
            nullPartisipant
          );
          matches.push(newMatch);
          matchId+=1
        }
      }
      //Обновляем кол-во необходимых к созданию мачей и раундов
      let resultPartisipantsinUpper = 0
      let resultPartisipantsinDown = 0
      if (matchesInRoundUpper>1){
        let participantsFromBuy =  0
        let winerPartisipantsInUpper = 0
        
        if(needBuyFirstRound>0){
          participantsFromBuy = needBuyFirstRound
          winerPartisipantsInUpper = ((matchesInRoundUpper-needBuyFirstRound))
          resultPartisipantsinUpper = Math.ceil((participantsFromBuy+ winerPartisipantsInUpper)/2)
        }
        else{
          winerPartisipantsInUpper = (matchesInRoundUpper)
          resultPartisipantsinUpper = Math.ceil(winerPartisipantsInUpper/2)
        }
      }

      if(matchesInRoundUpper>0||matchesInRoundDown>1){
        let loserPartisipantsInUpper = 0 
        let winerPartisipantsInDown = 0
        
        if (matchesInRoundUpper>0){
          if (needBuyFirstRound>0){
            loserPartisipantsInUpper = ((matchesInRoundUpper-needBuyFirstRound))
            resultPartisipantsinDown = loserPartisipantsInUpper
          }
          else{
            loserPartisipantsInUpper = (matchesInRoundUpper)
            resultPartisipantsinDown = loserPartisipantsInUpper
          }
        }
        if (matchesInRoundDown>1|| resultPartisipantsinDown!==0){
          winerPartisipantsInDown = (matchesInRoundDown)
          resultPartisipantsinDown = resultPartisipantsinDown+(winerPartisipantsInDown)
        }
      }
      matchesInRoundDown = Math.ceil(resultPartisipantsinDown/2)
      matchesInRoundUpper = (resultPartisipantsinUpper)
      currentRound++
      needBuyFirstRound = -1
    } 
    //Создаем финальный матч
    const final_match = generateMatch(0,matchId, currentRound, "final",false, nullPartisipant, nullPartisipant)
    matches.push(final_match)
    //Для каждого бая переносим сразу победителя в следующий матч
    matches
    .filter(m=>m.buyPass===true)
    .forEach(m=>{
      const newNextMatchWiner = nextWinerMatch(matches, m.id)
      if (!newNextMatchWiner){console.log("Матч не найден");}
      else {matches[newNextMatchWiner.id-1] = newNextMatchWiner}
    })
    console.log(matches);
    //Обновляем состояние турнира
    updateTournament(tournament.index, {mathes: matches })
  }



  const inputScore = (tournament: Tournaments, player: "a"|"b", matchId: number, value: number) => {
    const thisMatchIndex = tournament.mathes.findIndex(m => m.id === matchId)
    if (thisMatchIndex===-1){alert("Матч не найдем"); return}
    const thisMatch = {...tournament.mathes[thisMatchIndex]}
    player === 'a' ? //Определяем участника для которого ввели счет
      thisMatch.AScore = Number(value): 
      thisMatch.BScore = Number(value)
  
    const newMachesList = [...tournament.mathes]
    newMachesList[matchId-1] = thisMatch
    updateTournament(tournament.index, {mathes: newMachesList})
  }



  const checkScore = (tournament: Tournaments, matchId: number)=>{
    const thisMatchIndex = tournament.mathes.findIndex(m => m.id === matchId)
    if (thisMatchIndex===-1){alert("Матч не найдем"); return}
    const thisMatch = {...tournament.mathes[thisMatchIndex]}
    const newMachesList = [...tournament.mathes]
    if (thisMatch.completed && thisMatch.winer){
      console.log("Изменяем матч");
      
      //Если матч уже был завершен, то  нужно обнулить результаты матчей, куда перешли участники
        const nextRound = thisMatch.round+1;
          const editNextWinerMatch = [...newMachesList]
          .filter(m=>m.round>=nextRound && //Находим матчи где один из участников - участник этого матча
          (
            m.participantA?.id ===thisMatch.participantA?.id||
            m.participantA?.id ===thisMatch.participantB?.id||
            m.participantB?.id ===thisMatch.participantA?.id||
            m.participantB?.id ===thisMatch.participantB?.id
          ))
          .map(m=>{//Обнуляем участника и счет
            if (m.participantA?.id === thisMatch.participantA?.id || m.participantA?.id === thisMatch.participantB?.id) {
              console.log("первое условие");
              m.participantA = nullPartisipant;
              m.AScore = 0
              m.BScore = 0
            }
            if (m.participantB?.id === thisMatch.participantA?.id || m.participantB?.id === thisMatch.participantB?.id) {
               console.log("второе условие");
              m.participantB = nullPartisipant;
              m.AScore = 0
              m.BScore =0
            }
            return m
          })
          if (editNextWinerMatch.length>0){
            console.log("измененные матчи есть");
            
            editNextWinerMatch.map(m=>{
              newMachesList[m.id-1] = m 
            })
          }
    }
      if (thisMatch.AScore !=null && thisMatch.BScore!= null){//проверяем введен ли счет у обоих участников
      if (thisMatch.AScore > thisMatch.BScore){//Определяем победителя
        thisMatch.winer = thisMatch.participantA
        thisMatch.loser = thisMatch.participantB
     
      } 
    else if (thisMatch.AScore < thisMatch.BScore){
      thisMatch.winer = thisMatch.participantB
      thisMatch.loser = thisMatch.participantA
    }
    else if (thisMatch.AScore === thisMatch.BScore){//Если счет равный то победителя нет
      console.log("Счет ранвый");
      
      thisMatch.winer = nullPartisipant
      thisMatch.loser = nullPartisipant
    }
    }
    if (thisMatch.AScore!==null&& thisMatch.BScore!==null && (thisMatch.AScore!==thisMatch.BScore)){//Если счет у обоих участников указан
      thisMatch.completed=true//Матч считаем законченным
      newMachesList[matchId-1] = thisMatch
      const newUpdMatchList = [...newMachesList]
      console.log(`${newUpdMatchList}`);
      
      const newNextMatchWiner = nextWinerMatch(newUpdMatchList, matchId)//Вызываем функцию для определения следующего матча для победителя
      if (!newNextMatchWiner){console.log("Матч не найден");}
      else {newMachesList[newNextMatchWiner.id-1] = newNextMatchWiner}//Устанавливаем следущий мат для победителя
      if(thisMatch.gridType==='upper'){//Если сетка верхняя, тогда нужно определить матч для проигравшего
        const nextMatchLoser = nextLoserMatch(newUpdMatchList, matchId)//Находим этот матч
        if (!newNextMatchWiner|| nextMatchLoser===null){console.log("Матч не найден");}
        else newMachesList[nextMatchLoser.id-1] = nextMatchLoser
      }
      if (newMachesList.filter(m=> m.round === thisMatch.round&&m.completed === false).length===0) {//Проверяем все матчи данного раунда на "законченность"
        const nextRoundMatches = newMachesList.filter(m => m.round === thisMatch.round + 1)//Находим все матчи следующего раунда
        nextRoundMatches.forEach((nextMatch) => {//Для каждого из мачей смотрим участников
          const hasEmptySlot = //Есть ли матчи где отсутввует участник
            nextMatch.participantA?.id === -1 || 
            nextMatch.participantB?.id === -1 
          if (hasEmptySlot) {//Если такие есть, то они должны быть матчами-баями
            const updatedMatch = {...nextMatch}
            updatedMatch.buyPass = true//Устанавливаем что это бай матч
            if (updatedMatch.participantA?.id === -1 ) {//Находим пустого участника
              updatedMatch.winer = updatedMatch.participantB//Устанавливаем победителя
              updatedMatch.AScore = 0//Устанавливаем счет
              updatedMatch.BScore = 5
              updatedMatch.participantA = {id: -1, name: "buy"}
            } else if (updatedMatch.participantB?.id === -1) {
              updatedMatch.winer = updatedMatch.participantA
              updatedMatch.AScore = 5
              updatedMatch.BScore = 0
              updatedMatch.participantB = {id: -1, name: "buy"}
            }
            updatedMatch.completed = true//Устанавливаем "законченность" матча
            newMachesList[updatedMatch.id - 1] = updatedMatch//Обновляем матчи
            const nextBuyMatch = nextWinerMatch(newMachesList, updatedMatch.id)
            if (nextBuyMatch === null){console.log("Ошибка в бае");}
            else {newMachesList[nextBuyMatch.id - 1] = nextBuyMatch}
            
    
        }
      })
    }
      
    }
    updateTournament(tournament.index, {mathes: newMachesList})//Обновляем турнир с новыми матчами
  }



  const maxRound = (matches: Match[], gridType: "upper"|"down"|"final"|"all") => {//Вспомогательная функция для определения кол-ва раундов в сетке
    let maxRound = 0
    let matchesInGrid: Match[] =[]
    if (gridType!=="all"){ //Если не нужно находить максимальное кол-во матчей в турнире
      matchesInGrid=[...matches.filter(m=>m.gridType===gridType)]//То находим матчи определенной сетки
    }
    else {matchesInGrid = [...matches]}//Иначе находим все матчи
    if (matchesInGrid.length > 0){//Если матчи есть
      maxRound = Math.max(...matchesInGrid.map(m => m.round))}//Определяем максимальный раунд
    
    console.log(`maxRound: ${maxRound}`);
    
    return maxRound//Возвращаем 
  }



  const nextWinerMatch = (matches: Match[], matchId: number): Match | null => {//Вспомогательная функция для нахождения и заполнения матча для победителя
    const thisMatchIndex = matches.findIndex(m => m.id === matchId)
    if (thisMatchIndex===-1){alert("Матч не найдем"); return null}
    const currentMatch = {...matches[thisMatchIndex]}
    if (!currentMatch || !currentMatch.winer) {//Проверяме матч и наличие победителя
      return null;
    }
    const currentRound = currentMatch.round;//Текущий раунд
    const currentGrid = currentMatch.gridType;//Текущая сетка
    const winner = currentMatch.winer;//Победитель
    let nextMatchIndex = -1
    if (currentRound === maxRound(matches, currentMatch.gridType)) {//Если раунд этого матча последний в сетке то следующий матч = финал
      nextMatchIndex = matches.findIndex(m => m.gridType === "final")
      console.log("Следующий матч - финал");
    } 
    else {//Иначе находим матч в следующем раунде
      nextMatchIndex = matches.findIndex(m => 
        m.gridType === currentGrid && 
        m.round === currentRound + 1 && 
        m.indexInRound === Math.floor(currentMatch.indexInRound/2)//Матч определем по позиции в предыдущем (Победители 1 и 2 матча переходят в 1 матч следющего раунда и т.д.)
      )
    }
    if (nextMatchIndex===-1){console.log("not found"); return null}//Если след. матч так и не удалось найти
    const nextMatch =matches[nextMatchIndex]
    const updatedMatch: Match = { ...nextMatch };
    if(nextMatch.gridType!=='final'){//Проверяем что следующий матч не финал
      if (currentMatch.indexInRound%2 === 0) {//Победитель 1 матча займет позицию 1 игрока
      updatedMatch.participantA = winner;
      } 
      else if (currentMatch.indexInRound%2!==0) {//Победитель второго матча займет позицию 2 игрока
      updatedMatch.participantB = winner;
      }
    }
    else{//Если финал, то просто найти незанятое место 
      if(updatedMatch.participantA!.id<1){
        updatedMatch.participantA=winner
      }
      else updatedMatch.participantB = winner
    }
    return updatedMatch; //Вернуть матч
  };



  const nextLoserMatch=(matches: Match[], matchId: number): Match | null => {//Аналогично nextWinnerMatch только для проигравшего
    const thisMatchIndex = matches.findIndex(m => m.id === matchId)
    if (thisMatchIndex===-1){alert("Матч не найдем"); return null}
    const currentMatch = {...matches[thisMatchIndex]}
    if (!currentMatch || !currentMatch.loser) {
      return null;
    }
    const currentGrid = currentMatch.gridType;
    if(currentGrid === "down"){return null}
    const currentRound = currentMatch.round;
    const loser = currentMatch.loser;
    const nextRound = currentRound+1
    const nextMatch = matches
      .reverse()
      .find(m=> m.gridType === "down" && m.round === nextRound&& (m.participantA!.id<1||m.participantB!.id<1))
    if (!nextMatch) {
      return null;
    }
    const updatedMatch = {...nextMatch}
    if(updatedMatch.participantB!.id<1){
      updatedMatch.participantB = loser
    }
    else if (updatedMatch.participantA!.id<1){
      updatedMatch.participantA = loser
    }
    return updatedMatch
  }



const drawGrid = (thisTournament: Tournaments, grid: "upper" | "down" | "final", roundArr: number[]) => {
  const rounds = [...roundArr];
  
  // Для финальной сетки возвращаем ячейку с colSpan
  if (grid === "final") {  
    return (
      <td 
        key="final"
        colSpan={rounds.length} // Объединяем все колонки в строке
        className="finalTD"
      >
        {thisTournament.mathes
          .filter((a) => a.gridType === "final")
          .map((m) => (
            <div
              key={m.id}
              className="divMatch finalMatch"
            >
              {drawMatchesPartisipantInGrid(thisTournament, m, "a")}
              {drawMatchesPartisipantInGrid(thisTournament, m, "b")}
            </div>
          ))}
      </td>
    );
  }
  
  // Для верхней и нижней сетки
  return rounds.map(r => (
    <td key={`${grid}-${r}`}>
      {thisTournament.mathes
        .filter((a) => a.gridType === grid && a.round === r)
        ?.sort((a, b) => a.round - b.round)
        .map((m) => (
          <motion.div
            key={m.id}
            className="divMatch"
            initial={{ opacity: 0, y: 20 }}        // Начинаем прозрачным и ниже
            animate={{ opacity: 1, y: 0 }}         // Заканчиваем видимым на месте
            transition={{ duration: 0.8 }}          // За 0.3 секунды
            whileHover={{ scale: 1.08 }}            // При наведении чуть увеличиваем
          >
            {drawMatchesPartisipantInGrid(thisTournament, m, "a")}
            {drawMatchesPartisipantInGrid(thisTournament, m, "b")}
          </motion.div>
        ))}
    </td>
  ));
};
  const drawMatchesPartisipantInGrid = (thisTournament: Tournaments, m: Match, participant: "a"| "b")=>{
     let thisParsipiant: Participant|null
    if (participant==='a'){thisParsipiant = m.participantA}
    else {thisParsipiant = m.participantB}
    const isThisparsipiantWiner: boolean = m.winer === thisParsipiant
    return(
                  <div 
                  className="divPartisipant">
                  {/* В блоке span будет содержаться имя участника */}
                  <motion.span className="spanPartisipant"
                  animate={isThisparsipiantWiner ? {
        scale: [1, 1.2, 1],  // Массив значений для пульсации [citation:8]
        color: ['#333', '#2e7d32', '#2e7d32']
    } : {color: ['#333', '#333', '#333']}}
    transition={{ duration: 0.5 }}>
                    {participant === "a" &&m.participantA?.name}
                    {participant === "b" &&m.participantB?.name}
                  </motion.span>
                  {/* В блоке каждого участника так же должно содержаться поле с вводом его результатов */}
                  {!m.buyPass&&(m.participantA!.id>0)&&(m.participantB!.id>0)&&(
                  <input
                 className="inputScore"
                    maxLength={3}
                    value={participant === "a" 
                      ? (m.AScore===null?0: m.AScore) 
                      : (m.BScore===null?0: m.BScore)}
                    onChange={(e)=>{
                      let value = e.target.value
                      value = value.replace(/\D/g, '')
                      if (value!=="") inputScore(thisTournament, participant, m.id, Number(value))
                      else inputScore(thisTournament, participant, m.id, 0)
                    }}
                    onKeyDown={(e) => {
    if (e.key === 'Enter') {
      checkScore(thisTournament, m.id);
    }
  }}>
                  </input>)}
                  </div> 
    )
  }
  return {//Возвращаем все необходимое для доступа на других ст
    tour_name,
    description,  
    participants, 
    tournamentList, 

    setTour_name,
    setDescription,
    setParticipants,
    setTournamentList,
    setStatus,

    addParticipant,
    removeParticipant,
    updateParticipant,
    saveAndStart,
    findTournamet,
    updateTournament,
    stopTournament,
    createGrid,
    inputScore,
    checkScore,
    maxRound,
    drawGrid
  }
}
type TournamentContextType = ReturnType<typeof useTournament>;
const TournamentContext = createContext<TournamentContextType | undefined>(undefined);
export const TournamentProvider = ({ children }: { children: React.ReactNode }) => {
  const tournament = useTournament();
  return (
    <TournamentContext.Provider value={tournament}>
    {children}
    </TournamentContext.Provider>
  );
};
export const useTournamentContext = () => {
  const context = useContext(TournamentContext);
  if (context === undefined) {
    throw new Error('useTournamentContext must be used within a TournamentProvider');
  }
  return context;
}
