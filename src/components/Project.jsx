import { useState, useEffect } from "react";
import { materialItemsDB, laborItemsDB, inclusiveItemsDB } from "../database";
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ReactModal from 'react-modal'
import { TextField } from "@mui/material";
import { Link } from 'react-router-dom'

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      width: '700px',
      height: '300px',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

ReactModal.setAppElement('#root');

function Project() {
    const [materialItems, setMaterialItems] = useState([])
    const [laborItems, setLaborItems] = useState([])
    const [inclusiveItems, setInclusiveItems] = useState([])

    useEffect(() => {
        // setMaterialItems(materialItemsDB)
        // setLaborItems(laborItemsDB)
        // setInclusiveItems(inclusiveItemsDB)
    }, [])

    const createItem = (type, cost, title) => {

        const updatedArray = (array) => {

            function randomIntFromInterval(min, max) {
                return Math.floor(Math.random() * (max - min + 1) + min)
            }
            const rndInt = randomIntFromInterval(1, 500)

            return [...array, { id: rndInt, cost, title}]
        }

        if(type === "Material"){
            setMaterialItems(updatedArray(materialItems))
        }
        if(type === "Labor"){
            setLaborItems(updatedArray(laborItems))
        }
        if(type === "Inclusive"){
            setInclusiveItems(updatedArray(inclusiveItems))
        }

    }


    const updateItems = (id, type, {cost, title}) => {
        
        const updatedArray = (array) => {
            let idx = array.findIndex(item => item.id === id)
            let arr = [...array]
            arr.splice(idx, 1, { id, title, cost })
            return arr
        }

        if(type === "Material"){
            setMaterialItems(updatedArray(materialItems))
        }
        if(type === "Labor"){
            setLaborItems(updatedArray(laborItems))
        }
        if(type === "Inclusive"){
            setInclusiveItems(updatedArray(inclusiveItems))
        }
    }


    const deleteItem = (id, type) => {
        const updatedArray = (array) => {
            let idx = array.findIndex(item => item.id === id)
            let arr = [...array]
            arr.splice(idx, 1)
            return arr
        }

        if(type === "Material"){
            setMaterialItems(updatedArray(materialItems))
        }
        if(type === "Labor"){
            setLaborItems(updatedArray(laborItems))
        }
        if(type === "Inclusive"){
            setInclusiveItems(updatedArray(inclusiveItems))
        }

    }

    const sort = (type, category) => {
        const sortedArray = (array) => {
            return [...array].sort((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0))
        }


        setMaterialItems(sortedArray(materialItems))
    }

    const calculateEstimate = (arr) => {
        let estimate = 0
        arr.forEach(item => {
            estimate = estimate + Number(item.cost)
        })
        return estimate
    }

    return (
        <div>
            <h1>Estimate: ${calculateEstimate(materialItems.concat(laborItems).concat(inclusiveItems))}</h1>
            <div className="main-container">
                <LineItemsContainer type="Material" sort={sort} calculateEstimate={calculateEstimate} items={materialItems} createItem={createItem} updateItem={updateItems} deleteItem={deleteItem} />
                <LineItemsContainer type="Labor" calculateEstimate={calculateEstimate} items={laborItems} createItem={createItem} updateItem={updateItems} deleteItem={deleteItem}/>
                <LineItemsContainer type="Inclusive" calculateEstimate={calculateEstimate} items={inclusiveItems} createItem={createItem} updateItem={updateItems} deleteItem={deleteItem}/>
            </div>
            <Link to="/">
                <Button variant="contained">Save</Button>
            </Link>
        </div>
    );
}

function LineItemsContainer({ type, items, updateItem, calculateEstimate, createItem, deleteItem, sort }){
    
    const [modalOpen, toggleModal] = useState(false)

    const renderLineItems = () => {
        return items.map(item => 
            <LineItem type={type} key={item.id} item={item} update={updateItem} deleteItem={deleteItem}/>
        )
    }

    function closeModal() {
        toggleModal(false);
    }

    const addItemHandler = (cost, title) => {
        toggleModal(false)
        createItem(type, cost, title)
    }

    const sortHandler = (category) => {
        console.log(category)
        sort()
    }

    return (
        <div className="container-child">
            <h3>{type} Costs</h3>
            <h5>Total: ${calculateEstimate(items)}</h5>
            <Button color="success" variant="contained" onClick={() => toggleModal(true)}>Add {type} Cost</Button>
            {items.length ? 
            <ul>
                <li>
                    <div id="line-item-header" className="line-item">
                        <div style={{display: "flex", justifyContent: "space-between", width: "70%" }}>
                            <span onClick={() => sortHandler("title")} style={{marginLeft: "10px"}}>Item</span>
                            <span onClick={sortHandler}>Cost</span>
                        </div>
                        {/* <div>
                        </div> */}
                    </div>
                </li>
                {renderLineItems()}
            </ul>    
            :
            <h3>You currently have no items</h3>}
            <ItemModal open={modalOpen} submit={addItemHandler} close={closeModal}/>
        </div>
    )
}

function LineItem({ item, type, update, deleteItem }){
    const [editMode, toggleEditMode] = useState(false)

    const clickHandler = () => {
        toggleEditMode(!editMode)
    }

    const submitHandler = (cost, title) => {
        toggleEditMode(false)
        update(item.id, type, {cost, title})
    }

    const deleteHandler = (e) => {
        deleteItem(item.id, type)
    }

    
    function closeModal() {
        toggleEditMode(false);
    }

    return (
        <div>
        {editMode 
        ? 
            <ItemModal currentTitle={item.title} currentCost={item.cost} open={editMode} close={closeModal} submit={submitHandler}/>
        :
            <li>
                <div className="line-item">
                    <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", width: "70%", minHeight: "fit-content" }}>
                        <span id="item-title">{item.title}</span>
                        <span>${item.cost}</span>
                    </div>
                    <div className="line-item-buttons">
                        <EditIcon style={{cursor: "pointer"}} onClick={clickHandler}/>
                        <DeleteIcon style={{cursor: "pointer"}} onClick={deleteHandler} />  
                    </div>
                </div>
            </li>
        }
        </div>
    );
}

function ItemModal({ currentTitle, currentCost, open, close, submit }){
    const [title, setTitle] = useState(currentTitle || "")
    const [cost, setCost] = useState(currentCost || 0)


    const titleChangeHandler = (e) => {
        setTitle(e.target.value)
    }

    const costChangeHandler = (e) => {
        setCost(e.target.value)
    }

    const closeModal = () => {
        close()
    }

    const submitHandler = () => {
        submit(cost, title)
    }

    return (
        <ReactModal
        isOpen={open}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
        >
        <div className="item-modal">
            <form onSubmit={submitHandler}>
                <TextField
                defaultValue={title}
                onChange={titleChangeHandler} 
                label="Item"
                size="small"
                />
                <TextField
                defaultValue={cost}
                onChange={costChangeHandler}  
                label="Cost"
                size="small"
                type="number"
                />
                <Button style={{width: "100px"}} variant="outlined" type="submit">Save</Button>
            </form>
            <Button color="error" style={{width: "50px"}} variant="outlined" onClick={closeModal}>close</Button>
        </div>
    </ReactModal>  
    )
}

export default Project;