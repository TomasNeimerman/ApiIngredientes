const axios = require('axios');
const xlsx = require('xlsx');
const fs = require('fs');

// Tu clave API de Edamam
const apiKey = '0b24c4565c3434198ba4f7dfc2b2392b';
const appId = '8335a680';

// Lista de ingredientes en inglés
const ingredientes = [
  'Chicken', 'Chicken breast', 'Chicken thigh', 'Chicken wings', 'Ground beef', 'Beef steak', 
  'Beef ribs', 'Beef loin', 'Pork', 'Pork ribs', 'Pork loin', 'Pork chop', 'Pork belly', 'Ham', 
  'Bacon', 'Pork chorizo', 'Pork sausage', 'Lamb', 'Lamb leg', 'Lamb rib', 'Carrot', 'Potato', 
  'Onion', 'Garlic', 'Tomato', 'Bell pepper', 'Zucchini', 'Eggplant', 'Broccoli', 'Cauliflower', 
  'Spinach', 'Lettuce', 'Cucumber', 'Asparagus', 'Mushroom', 'Celery', 'Radish', 'Artichoke', 
  'Pea', 'Corn', 'Apple', 'Banana', 'Orange', 'Strawberry', 'Grape', 'Pineapple', 'Mango', 
  'Pear', 'Melon', 'Watermelon', 'Kiwi', 'Peach', 'Cherry', 'Lemon', 'Tangerine', 'Papaya', 
  'Plum', 'Fig', 'Coconut', 'Wheat flour', 'Corn flour', 'Oat flour', 'Whole wheat flour', 
  'Rice flour', 'Spelt flour', 'Lentils', 'Chickpeas', 'Black beans', 'Red beans', 'White beans', 
  'Broad beans', 'Split peas', 'Soybeans', 'Peanuts', 'Lupins', 'Almonds', 'Walnuts', 'Hazelnuts', 
  'Pistachios', 'Cashews', 'Macadamia nuts', 'Pecans', 'Pine nuts', 'Chestnuts', 'Sunflower seeds', 
  'Salmon', 'Tuna', 'Cod', 'Sardines', 'Trout', 'Hake', 'Shrimp', 'Prawns', 'Mussels', 'Clams', 
  'Oysters', 'Octopus', 'Squid', 'Lobster', 'Crab', 'Tilapia', 'Swordfish', 'Mackerel', 'Anchovies', 
  'Sea bass', 'Milk', 'Yogurt', 'Butter', 'Cream', 'Cheddar cheese', 'Mozzarella cheese', 
  'Parmesan cheese', 'Brie cheese', 'Blue cheese', 'Feta cheese', 'Cottage cheese', 'Goat milk', 
  'Goat cheese', 'Condensed milk', 'Evaporated milk', 'Sour cream', 'Ricotta cheese', 'Gouda cheese', 
  'Manchego cheese', 'Gruyere cheese',  'Chorizo', 'Mortadella', 'Salami', 'Longaniza', 
  'Sobrasada', 'Fuet', 'Cured loin', 'Chistorra', 'Botifarra', 'Dark chocolate', 'Milk chocolate', 
  'White chocolate', 'Cocoa powder', 'Dulce de leche', 'Honey', 'Strawberry jam', 'Peach jam', 
  'White sugar', 'Brown sugar', 'Caramel', 'Gelatin', 'Marshmallows', 'Cookies', 'Marzipan', 
  'Soy sauce', 'Apple cider vinegar', 'Balsamic vinegar', 'Mustard', 'Mayonnaise', 'Ketchup', 
  'BBQ sauce', 'Tabasco sauce', 'Worcestershire sauce', 'Basil', 'Oregano', 'Parsley', 'Cilantro', 
  'Thyme', 'Rosemary', 'Salt', 'Black pepper', 'Cinnamon', 'Nutmeg', 'Saffron', 'Olive oil', 
  'Sunflower oil', 'Canola oil', 'Coconut oil', 'Sesame oil', 'Corn oil', 'Avocado oil', 'Peanut oil', 
  'Soybean oil', 'Linseed oil', 'Rice', 'Oats', 'Wheat', 'Barley', 'Rye', 'Corn', 'Millet', 'Quinoa', 
  'Amaranth', 'Spelt', 'Sorghum', 'Teff', 'Brown rice', 'Basmati rice', 'Jasmine rice', 'White corn', 
  'Bulgur wheat', 'Couscous'
];

// Función para obtener información nutricional de un ingrediente
const getNutritionalInfo = async (ingredient) => {
  try {
    const response = await axios.get(`https://api.edamam.com/api/food-database/v2/parser?ingr=${encodeURIComponent(ingredient)}&app_id=${appId}&app_key=${apiKey}`);
    const food = response.data.hints[0].food;

    return {
      nombre: ingredient,
      calorias: food.nutrients.ENERC_KCAL || 0,
      carbohidratos: food.nutrients.CHOCDF || 0,
      grasas: food.nutrients.FAT || 0,
      proteinas: food.nutrients.PROCNT || 0,
    };
  } catch (error) {
    console.error(`Error al obtener información nutricional de ${ingredient}:`, error.message);
    return null;
  }
};

// Función principal para obtener la información de todos los ingredientes y crear el archivo Excel
const main = async () => {
  const data = [];

  for (const ingredient of ingredientes) {
    const info = await getNutritionalInfo(ingredient);
    if (info) {
      data.push(info);
    }
  }

  // Crear el archivo Excel
  const worksheet = xlsx.utils.json_to_sheet(data);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Ingredientes');

  xlsx.writeFile(workbook, 'ingredientes.xlsx');

  console.log('Archivo Excel creado con éxito: ingredientes.xlsx');
};

main();
