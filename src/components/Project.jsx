import { useState, useEffect } from "react";
import { lineItemsDB } from "../database";

function Project() {
    const [lineItems, setLineItems] = useState([])

    useEffect(() => {
        setLineItems(lineItemsDB)
    })


    const updateItem = (id, {cost, title}) => {
        console.log(id, cost, title)
        const idx = lineItems.findIndex(item => item.id === id)
        setLineItems(lineItems.splice(idx, 1, {id, cost, title}))
    }

    const deleteItem = (id) => {

    }

    const calculateEstimate = () => {
        let estimate = 0
        lineItems.forEach(item => {
            estimate = estimate + Number(item.cost)
        })
        return estimate
    }


    const renderLineItems = () => {
        return lineItems.map(item => 
            <LineItem key={item.id} item={item} update={updateItem}/>
        )
    }

    return (
        <div>
            <h1>Estimate: {calculateEstimate()}</h1>
            <h3>Material Costs</h3>
            <ul>{renderLineItems()}</ul>
            <h3>Labor Costs</h3>
            <h3>All Inclusive Costs</h3>
        </div>
    );
}

function LineItem({ item, update }){
    const [title, setTitle] = useState("")
    const [cost, setCost] = useState(0)
    const [editMode, toggleEditMode] = useState(false)

    const clickHandler = () => {
        setTitle(item.title)
        setCost(item.cost)
        toggleEditMode(!editMode)
    }

    const titleChangeHandler = (e) => {
        setTitle(e.target.value)
    }

    const costChangeHandler = (e) => {
        setCost(e.target.value)
    }

    const submitHandler = (e) => {
        toggleEditMode(false)
        update(item.id, {cost, title})
    }

    return (
        <div>
        {editMode 
        ? 
            <li>
                <div style={{border: "solid"}}>
                    <form onSubmit={submitHandler}>
                        <input
                        defaultValue={title}
                        onChange={titleChangeHandler} 
                        />
                        <input
                        defaultValue={cost}
                        onChange={costChangeHandler}  
                        type="number"
                        />
                        <button type="submit">Save</button>
                    </form>
                    <button>Delete</button>   
                </div>
            </li>
        :
            <li>
                <div style={{border: "solid"}}>
                    <span style={{color: "black"}}>{item.title}</span>
                    <span>{item.cost}</span>
                    <button onClick={clickHandler}>Edit</button>
                    <button>Delete</button>   
                </div>
            </li>
        }
        </div>
    );
}

export default Project;