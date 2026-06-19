import { useParams } from "react-router";
import { useTournamentContext } from "../logic"
import { useEffect, useState } from "react";
import "../index.css"

export default function grid_page(){
  
  const {findTournamet, createGrid, maxRound,drawGrid} = useTournamentContext()
  const {id} = useParams()//Находим id из url
  if (!id) {
    return <div>Неверный идентификатор турнира</div>;
  }
  const tournamentId = Number(id);
  const thisTournament = findTournamet(tournamentId)//Находим этот турнир
  useEffect (()=>{if (thisTournament.mathes.length===0){
    createGrid(thisTournament);//Создаем турнирную сетку
    console.log(thisTournament);
  }},[])
  const [rounds, setRounds] = useState(0)
  useEffect (()=>{
    const res = maxRound(thisTournament.mathes, "all")-1//Находим кол-во раундов
    setRounds(res)
  })
const roundArr = (Array.from({ length: rounds }, (_, i) => i + 1));//Создаем массив с раундами для дальнейшей работы
useEffect(() => {
  console.log('=== ОТЛАДКА ===');
  console.log('Все матчи:', thisTournament.mathes);
  console.log('roundArr:', roundArr);
  
  // Проверяем верхнюю сетку
  roundArr.forEach(round => {
    const matches = thisTournament.mathes.filter(m => 
      m.gridType === "upper" && m.round === round
    );
    if (matches.length > 0) {
      console.log(`Верхняя сетка, раунд ${round}:`, matches.length, 'матчей');
    }
  });
  
  // Проверяем нижнюю сетку
  roundArr.forEach(round => {
    const matches = thisTournament.mathes.filter(m => 
      m.gridType === "down" && m.round === round
    );
    if (matches.length > 0) {
      console.log(`Нижняя сетка, раунд ${round}:`, matches.length, 'матчей');
    }
  });
}, [thisTournament.mathes, roundArr]);
  return (
    <div>
      <h1>Турнирная сетка</h1>{/* Заголовок на странице */}
      {/* Таблица для корректного отображения матчей на странице */}
      <table style={{
        tableLayout: "fixed",
      }}>
        <thead>{/* Заголок таблицы где будут указаны номера раундов */}
          <tr key={"headerUpperTR"}>
            <td key={"HeaderUpperTD"} colSpan={rounds} style={{ textAlign: 'center'}}><h2>Верхняя сетка</h2></td>{/* Обозначение верхней сетки */}
          </tr>
          <tr key={"roundListTR"}>
            {roundArr.map(r=>
              <th 
              key={"th"+r}>
                Раунд {r}
              </th>
            )}
          </tr>
        </thead>
      <tbody>{/* Содержимое таблицы с сетками */}
        <tr key={"uperRoundContetntTR"}>{/* В новой строке таблицы выводим все матчи */}
          {drawGrid(thisTournament,"upper",roundArr)}
        </tr>
        {/* Все аналогично для нижней сетки */}
        <tr key={"downHeaderTR"}><td key={"downHeaderTD"} colSpan={rounds} style={{textAlign: 'center'}}> <h2>Нижняя сетка</h2></td></tr>
        <tr key={"downContentTR"}>{/* В новой строке таблицы выводим все матчи */}
          {drawGrid(thisTournament,"down",roundArr)}
        </tr>
        <tr key={"finalHeaderTR"}>
          <td key={"finalHeaderTD"} colSpan={rounds} style={{textAlign: 'center'}}><h2>Финал</h2></td>
        </tr>
        <tr>
            {drawGrid(thisTournament,"final",roundArr)}
        </tr>
      </tbody>
    </table>
  </div>
  )
}