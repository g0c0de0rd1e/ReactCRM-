import ReceptIngredients from './box-ingredients';
import ReceptInstructions from './box-instructions';
import ReceptMain from './box-main';
import ReceptNutritions from './box-nutritions';
import ReceptStocks from './box-stocks';

export const steps = [
  {
    step: 1,
    title: 'box',
    content: ReceptMain,
  },
  {
    step: 2,
    title: 'instructions',
    content: ReceptInstructions,
  },
  {
    step: 3,
    title: 'ingredients',
    content: ReceptIngredients,
  },
  {
    step: 4,
    title: 'stocks',
    content: ReceptStocks,
  },
  {
    step: 5,
    title: 'nutritions',
    content: ReceptNutritions,
  },
];
