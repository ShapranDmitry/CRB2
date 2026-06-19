import { useParams } from "react-router";
import { useTournamentContext } from "../logic"
import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'
import "../index.css"
import type { Match } from "../logic";
import type { Tournaments } from "../logic";
export default function grid_page(){
const {findTournamet, createGrid, maxRound} = useTournamentContext()
  const {id} = useParams()//Находим id из url
  if (!id) {
    return <div>Неверный идентификатор турнира</div>;
  }
  const tournamentId = Number(id);
  const thisTournament = {...findTournamet(tournamentId)}//Находим этот турнир
  useEffect (()=>{if (thisTournament.mathes.length===0){
    createGrid(thisTournament);//Создаем турнирную сетку
    console.log(thisTournament);
  }})
  const matches = {...thisTournament.mathes}
  const columnHelper = createColumnHelper<Match>();
  const columns = [{}]
  const [rounds, setRounds] = useState(0)
  useEffect (()=>{
    const res = maxRound(thisTournament.mathes, "all")-1//Находим кол-во раундов
    setRounds(res)
  })
const roundArr = (Array.from({ length: rounds }, (_, i) => i + 1));//Создаем массив с раундами для дальнейшей работы
    return(
        <h1></h1>
    )
}