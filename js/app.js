class CalorieTracker {
    constructor() {
        this._calorieLimit = Storage.getCalorieLimit();
        this._totalCalories = Storage.getTotalCalories();
        this._meals = Storage.getMeals();
        this._workouts = Storage.getWorkouts();
        this._displayCaloriesTotal();
        this._displayCaloriesLimit();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayProgress();

        document.getElementById('limit').value = this._calorieLimit;
    }

    //public
    addMeal(meal) {
        this._meals.push(meal);
    
        this._totalCalories += meal.calories;
        Storage.updateTotalCalories(this._totalCalories);
        Storage.saveMeal(meal);
        this._displayNewMeal(meal);
        this._render();
    }
    
    addWorkout(workout) {
        this._workouts.push(workout);
        this._totalCalories -= workout.calories;
        Storage.updateTotalCalories(this._totalCalories);
        Storage.saveWorkout(workout);
        this._displayNewWorkout(workout);
        this._render();
    }

    removeMeal(id) {
        const index = this._meals.findIndex((meal) => meal.id === id);

        if( index !== -1) {
            const meal = this._meals[index];
            this._totalCalories -= meal.calories;
            Storage.updateTotalCalories(this._totalCalories);
            Storage.removeMeal(id);
            this._meals.splice(index,1);
            this._render();
        }
    }

    removeWorkout(id) {
        const index = this._workouts.findIndex((workout) => workout.id === id);

        if( index !== -1) {
            const workout = this._workouts[index];
            this._totalCalories += workout.calories;
            Storage.updateTotalCalories(this._totalCalories);
            Storage.removeWorkout(id);
            this._workouts.splice(index,1);
            this._render();
        }
    }

    reset() {
        this._totalCalories = 0;
        this._meals = [];
        this._workouts = [];
        this._render();
        Storage.clearAll();
    }

    setLimit(calorieLimit) {
        this.calorieLimit = calorieLimit;
        Storage.setCalorieLimit(calorieLimit);
        this._displayCaloriesLimit();
        this._render();
    }

    loadItems(item) {
        if( item === 'meal') {
            this._meals.forEach(meal => this._displayNewMeal(meal));
        } else {
            this._workouts.forEach(workout => this._displayNewWorkout(workout));
        }
    }
    //private
    _displayCaloriesTotal() {
        const totalCaloriesEl = document.getElementById('calories-total');
        totalCaloriesEl.innerHTML = this._totalCalories;
    }

    _displayCaloriesLimit() {
        const caloriesLimitEl = document.getElementById('calories-limit');
        caloriesLimitEl.innerHTML = this._calorieLimit;

    }

    _displayCaloriesConsumed() {
        const caloriesConsumedEl = document.getElementById('calories-consumed');
        const consumed = this._meals.reduce((total, meal) => total + meal.calories, 0);
        caloriesConsumedEl.innerHTML = consumed;
    }

    _displayCaloriesBurned() {
        const caloriesBurnedEl = document.getElementById('calories-burned');
        const burned = this._workouts.reduce((total, workout) => total + workout.calories, 0);
        caloriesBurnedEl.innerHTML = burned;
    }

    _displayCaloriesRemaining() {
        const caloriesRemainingEl = document.getElementById('calories-remaining');
        const progressEl = document.getElementById('calorie-progress');

        const remaining = this._calorieLimit - this._totalCalories;

        if( remaining <= 0 ) {
            caloriesRemainingEl.parentElement.parentElement.classList.remove('bg-light');
            caloriesRemainingEl.parentElement.parentElement.classList.add('bg-danger');
            progressEl.classList.remove('bg-success');
            progressEl.classList.add('bg-danger');
        }
        else {
            caloriesRemainingEl.parentElement.parentElement.classList.remove('bg-danger');
            caloriesRemainingEl.parentElement.parentElement.classList.add('bg-light');
            progressEl.classList.remove('bg-danger');
            progressEl.classList.add('bg-success');
        }
        caloriesRemainingEl.innerHTML = remaining;
    }

    _displayProgress() {
        const progressEl = document.getElementById('calorie-progress');
        const percentage = (this._totalCalories / this._calorieLimit)*100;
        const width = Math.min(percentage, 100);
        progressEl.style.width = `${width}%`;
    }

    _displayNewMeal(meal) {
        const mealsEl = document.getElementById('meal-items');
        const mealEl = document.createElement('div');
        mealEl.classList.add('card', 'my-2');
        mealEl.setAttribute('data-id', meal.id);

        mealEl.innerHTML = `
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                    <h4 class="mx-1">${meal.name}</h4>
                    <div
                        class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5">
                        ${meal.calories}
                    </div>
                    <button class="delete btn btn-danger btn-sm mx-2">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>
        `;
        mealsEl.appendChild(mealEl);

    }

    _displayNewWorkout(workout) {
        const workoutsEl = document.getElementById('workout-items');
        const workoutEl = document.createElement('div');
        workoutEl.classList.add('card', 'my-2');
        workoutEl.setAttribute('data-id', workout.id);

        workoutEl.innerHTML = `
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                    <h4 class="mx-1">${workout.name}</h4>
                    <div
                        class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5">
                        ${workout.calories}
                    </div>
                    <button class="delete btn btn-danger btn-sm mx-2">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>
        `;
        workoutsEl.appendChild(workoutEl);

    }


 

    _render() {
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayProgress();
    }
}

class Meal {
    constructor(name, calories) {
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
    }
}

class Workout {
    constructor(name, calories) {
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
    }
}
class App {
    constructor() {
        this._tracker = new CalorieTracker();
        this._tracker.loadItems('meal');
        this._tracker.loadItems('workout');

        document.getElementById('meal-form').addEventListener('submit', 
            this._newItem.bind(this, 'meal'));
        document.getElementById('workout-form').addEventListener('submit', 
            this._newItem.bind(this, 'workout'));

        document.getElementById('meal-items')
        .addEventListener('click', this._removeItem.bind(this, 'meal'));
        document.getElementById('workout-items')
        .addEventListener('click', this._removeItem.bind(this, 'workout'));

        document.getElementById('filter-meals')
        .addEventListener('keyup', this._filterItems.bind(this, 'meal'));

        document.getElementById('filter-workouts')
        .addEventListener('keyup', this._filterItems.bind(this, 'workout'));

        document.getElementById('reset').addEventListener('click', this._reset.bind(this));

        document.getElementById('limit-form').addEventListener('submit', this._setLimit.bind(this));
    }

    _newItem(type, e) {
        e.preventDefault();

        const name = document.getElementById(`${type}-name`);
        const calories = document.getElementById(`${type}-calories`);

        if( name.value === '' || calories.value === '') {
            alert('Please fill in all fields');
            return;
        }
        if( type === 'meal') {
            const meal = new Meal(name.value, +calories.value);
            this._tracker.addMeal(meal);
        } else {
            const workout = new Workout(name.value, +calories.value);
            this._tracker.addWorkout(workout);
        }

        name.value = '';
        calories.value = '';

        const collapseItem = document.getElementById(`collapse-${type}`);
        const bsCollapse = new bootstrap.Collapse(collapseItem, {
            toggle: true,
        });
    }

    _removeItem(type, e) {
        console.log(e, type);
        if(
            e.target.classList.contains('delete') ||
            e.target.classList.contains('fa-xmark') 
        ) {
            console.log("in remove item");
            if(confirm('Are you sure?')) {
                const id = e.target.closest('.card').getAttribute('data-id');
                type === 'meal'
                ? this._tracker.removeMeal(id)
                : this._tracker.removeWorkout(id);

                e.target.closest('.card').remove();
            }
        }
    }

    _reset() {
        this._tracker.reset();
        document.getElementById('meal-items').innerHTML = '';
        document.getElementById('workout-items').innerHTML = '';
        document.getElementById('filter-meals').value = '';
        document.getElementById('filter-workouts').value = '';

    }

    _filterItems(type, e) {
        const text = e.target.value.toLowerCase();
        document.querySelectorAll(`${type}-items .card`).forEach(item => {
            const name = item.firstElementChild.firstElementChild.textContent;
            if( name.toLowerCase().indexOf(text) !== -1 ) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    _setLimit(e) {
        e.preventDefault();
        const limit = document.getElementById('limit');

        if( limit.value === '') {
            alert('please add a limit');
            return;
        }

        this._tracker.setLimit(+limit.value);
        limit.value = '';

        const modalEl = document.getElementById('limit-modal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();
    }

    // _newMeal(e) {
    //     e.preventDefault();

    //     const name = document.getElementById('meal-name');
    //     const calories = document.getElementById('meal-calories');

    //     if( name.value == '' || calories.value === '') {
    //         alert('Please fill in all fields');
    //         return;
    //     }

    //     const meal = new Meal(name.value, +calories.value);
    //     this._tracker.addMeal(meal);
    //     name.value = '';
    //     calories.value = '';

    //     const collapseMeal = document.getElementById('collapse-meal');
    //     const bsCollapse = new bootstrap.Collapse(collapseMeal, {
    //         toggle: true,
    //     });
    // }

    // _newWorkout(e) {
    //     e.preventDefault();

    //     const name = document.getElementById('workout-name');
    //     const calories = document.getElementById('workout-calories');

    //     if( name.value == '' || calories.value === '') {
    //         alert('Please fill in all fields');
    //         return;
    //     }

    //     const workout = new Workout(name.value, +calories.value);
    //     this._tracker.addWorkout(workout);
    //     name.value = '';
    //     calories.value = '';

    //     const collapseWorkout = document.getElementById('collapse-workout');
    //     const bsCollapse = new bootstrap.Collapse(collapseWorkout, {
    //         toggle: true,
    //     });
    // }

}

class Storage {
    static getCalorieLimit(defaultLimit = 2000 ) {
        let calorieLimit;
        if( localStorage.getItem('calorieLimit') === null) {
            calorieLimit = defaultLimit;
        } else {
            calorieLimit = +localStorage.getItem('calorieLimit');
        }

        return calorieLimit;
    }

    static setCalorieLimit(calorieLimit) {
        localStorage.setItem('calorieLimit', calorieLimit);
    }

    static getTotalCalories( defaultCaloires = 0) {
        let totalCalories;
        if( localStorage.getItem('totalCalories') === null) {
            totalCalories = defaultCaloires;
        } else {
            totalCalories = +localStorage.getItem('totalCalories');
        }

        return totalCalories;
    }
    static updateTotalCalories( calories) {
        localStorage.setItem('totalCalories', calories);
    }

    static getMeals() {
        let meals;
        if( localStorage.getItem('meals') === null) {
            meals = [];
        } else {
            meals = JSON.parse(localStorage.getItem('meals'));
        }

        return meals;
    }

    static saveMeal(meal) {
        const meals = Storage.getMeals();
        meals.push(meal);
        localStorage.setItem('meals', JSON.stringify(meals));
    }

    static removeMeal(id) {
        const meals = Storage.getMeals();
        meals.forEach((meal, index) => {
            if( meal.id === id ) {
                meals.splice(index, 1);
            }
        });
        localStorage.setItem('meals', JSON.stringify(meals));
    }

    static removeWorkout(id) {
        const workouts = Storage.getWorkouts();
        workouts.forEach((workout, index) => {
            if( workout.id === id ) {
                workouts.splice(index, 1);
            }
        });
        localStorage.setItem('workouts', JSON.stringify(workouts));
    }

    static getWorkouts() {
        let workouts;
        if( localStorage.getItem('workouts') === null) {
            workouts = [];
        } else {
            workouts = JSON.parse(localStorage.getItem('workouts'));
        }

        return workouts;
    }

    static saveWorkout(workout) {
        const workouts = Storage.getWorkouts();
        workouts.push(workout);
        localStorage.setItem('workouts', JSON.stringify(workouts));
    }

    static clearAll() {
        const calorieLimit = Storage.getItem('calorieLimit');
        Storage.clear();
        Storage.setItem('calorieLimit', calorieLimit);
    }

}
const app = new App();
// const tracker = new CalorieTracker();
// const breakfast = new Meal('breakfast', 400);
// const lunch = new Meal('lunch', 300);
// tracker.addMeal(breakfast);
// tracker.addMeal(lunch);
// const run = new Workout('run', 300);
// tracker.addWorkout(run);

// console.log(tracker._calorieLimit);
// console.log(tracker._meals, tracker._workouts);
// console.log(tracker._totalCalories);