import { useState, useEffect } from "react";
import { materialItemsDB, laborItemsDB, inclusiveItemsDB } from "../database";
import ReactModal from 'react-modal'

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

ReactModal.setAppElement('#root');

function Project() {
    const [lineItems, setLineItems] = useState([])

    const [materialItems, setMaterialItems] = useState([])
    const [laborItems, setLaborItems] = useState([])
    const [inclusiveItems, setInclusiveItems] = useState([])
    // const [laborItems, setLaborItems] = useState([])
    // const [inclusiveItems, setInclusiveItems] = useState([])

    useEffect(() => {

        // console.log("Hit ?")
        // const materialArr = []
        // const laborArr = []
        // const inclusiveArr = []

        // lineItemsDB.forEach(item => {
        //     if(item.type === "material"){
        //         materialArr.push(item)
        //     }
        //     if(item.type === "labor"){
        //         laborArr.push(item)
        //     }
        //     if(item.type === "inclusive"){
        //         inclusiveArr.push(item)
        //     }
        // })

        // setLineItems(lineItemsDB)

        setMaterialItems(materialItemsDB)
        setLaborItems(laborItemsDB)
        setInclusiveItems(inclusiveItemsDB)
        // setLaborItems(laborArr)
        // setInclusiveItems(inclusiveArr)
    }, [])


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

    const calculateEstimate = (arr) => {
        let estimate = 0
        arr.forEach(item => {
            estimate = estimate + Number(item.cost)
        })
        return estimate
    }

    const sortItems = () => {
        const obj = {
            materialItems: [],
            laborItems: [],
            inclusiveItems: [],
        }
        
        lineItems.forEach(item => {
            if(item.type === "material"){
                obj.materialItems.push(item)
            }
            if(item.type === "labor"){
                obj.laborItems.push(item)
            }
            if(item.type === "inclusive"){
                obj.inclusiveItems.push(item)
            }
        })

        return obj
    }


    // const renderLineItems = () => {
    //     return lineItems.map(item => 
    //         <LineItem key={item.id} item={item} update={updateItem}/>
    //     )
    // }

    return (
        <div>
            <h1>Estimate: ${calculateEstimate(lineItems)}</h1>
            <div className="main-container">
                <LineItemsContainer type="Material" calculateEstimate={calculateEstimate} items={materialItems} updateItem={updateItems} deleteItem={deleteItem} />
                <LineItemsContainer type="Labor" calculateEstimate={calculateEstimate} items={laborItems} updateItem={updateItems} deleteItem={deleteItem}/>
                <LineItemsContainer type="Inclusive" calculateEstimate={calculateEstimate} items={inclusiveItems} updateItem={updateItems} deleteItem={deleteItem}/>
            </div>
        </div>
    );
}

function LineItemsContainer({ type, items, updateItem, calculateEstimate, deleteItem }){
    

    const renderLineItems = () => {
        return items.map(item => 
            <LineItem type={type} key={item.id} item={item} update={updateItem} deleteItem={deleteItem}/>
        )
    }

    const addItemHandler = () => {

    }

    return (
        <div className="container-child">
            <h3>{type} Costs</h3>
            <button>Add {type} Cost</button>
            <p>Total: {calculateEstimate(items)}</p>
            <ul>{renderLineItems()}</ul>    
        </div>
    )
}

function LineItem({ item, type, update, deleteItem }){
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
        update(item.id, type, {cost, title})
    }

    const deleteHandler = (e) => {
        deleteItem(item.id, type)
    }

    function openModal() {
        toggleEditMode(true);
    }

    
    function closeModal() {
        toggleEditMode(false);
    }


    const renderModal = () => {
       return (
        <ReactModal
            isOpen={editMode}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
        >
            <div>
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
                <button onClick={closeModal}>close</button>
            </div>
        </ReactModal>   
       ) 
    }

    return (
        <div>
        {editMode 
        ? 
            renderModal()
        :
            <li>
                <div className="line-item">
                    <div style={{display: "flex", justifyContent: "space-around", width: "50%" }}>
                        <span style={{color: "black"}}>{item.title}</span>
                        <span>${item.cost}</span>
                    </div>
                    <div>
                        <button onClick={clickHandler}>Edit</button>
                        <button onClick={deleteHandler}>Delete</button>   
                    </div>
                </div>
            </li>
        }
        </div>
    );
}

export default Project;