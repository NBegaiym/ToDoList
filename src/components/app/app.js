import React, {Component} from "react";
import "./app.css";
import AppHeader from "../appHeader";
import SearchPanel from "../searchpanel";
import ToDoList from "../todo-list";
import ItemStatusFilter from "../item-status-filter";
import ItemAddForm from "../itemAddForm";


class App extends Component {

    max = 100;

    state = {

        todoData: [
            {label: 'Drink MilkShake', id: 1,},
            {label: 'Go to Sleep', id: 2},
            {label: 'Drink Water', id: 3},
            {label: 'Die', id: 4},

        ],
        term: '',
        filter: 'all'

    };

    createTodoItem(label) {
        return {
            label: label,
            id: this.max++,
            important: false,
            done: false
        }
    }

    addItemForm = (text) => {
        const newItem = this.createTodoItem(text);

        this.setState(({todoData}) => {
            const newArr = [...todoData, newItem];
            return {todoData: newArr}
        })
    };

    toggleProperty(arr, id, propName) {
        const idx = arr.findIndex((el) => el.id === id);
        let oldItem = arr[idx];
        let newItem = {...oldItem, [propName]: !oldItem[propName]};
        return [...arr.slice(0, idx), newItem, ...arr.slice(idx + 1)];
    }


    deleteItem = (id) => {
        this.setState(({todoData}) => {
            const idx = todoData.findIndex((el) => el.id === id);
            todoData.splice(idx, 1);
            const before = todoData.slice(0, idx);
            const after = todoData.slice(idx);
            const newArray = [...before, ...after];
            return {todoData: newArray}
        })
    };

    onToggleDone = (id) => {
        this.setState(({todoData}) => {
                return {todoData: this.toggleProperty(todoData, id, 'done')};
            }
        )
    };
    onToggleImportant = (id) => {
        this.setState(({todoData}) => {
                return {todoData: this.toggleProperty(todoData, id, 'important')};
            }
        )
    };

    searchOnChange(term) {
        this.setState({term})
    }

    search(items, term) {

        return items.filter((item) => {
            return item.label.includes(term);
        })
    }
    onFilterChange = (name)=> {
        this.setState({filter:name})
    };

    filter (items, filter) {
        switch (filter) {
            case 'all': return items;
            case 'active': return items.filter((item)=> !item.done);
            case 'done': return items.filter((item)=> item.done);
            default:
                return items



        }
    }

    render() {

        const {todoData, term, filter} = this.state;
        const doneCount = todoData.filter((el) => el.done).length;
        const todoCount = todoData.length - doneCount;
        const visibleItems = this.filter(this.search(todoData, term), filter);


        return (

            <div className='todo-app'>
                <AppHeader toDo={todoCount} done={doneCount}/>
                <div className='top-panel d-flex'>
                    <SearchPanel
                        searchTerm={this.searchOnChange.bind(this)}/>
                    <ItemStatusFilter
                        filter={filter}
                        onFilterChange = {this.onFilterChange}
                    />
                </div>
                <ToDoList todos={visibleItems}
                          onAppDeleted={this.deleteItem.bind(this)}
                          onToggleImportant={this.onToggleImportant}
                          onToggleDone={this.onToggleDone}
                />
                <ItemAddForm addItem={this.addItemForm}/>
            </div>
        )

    }
}

export default App;