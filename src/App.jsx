import GraphArea from "./components/GraphArea"
import { FilterProvider } from "./providers/FilterProvider"

export default function App(){
  return (
    <FilterProvider>
      <GraphArea/>
    </FilterProvider>
  )
}