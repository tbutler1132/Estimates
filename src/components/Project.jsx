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

    const createItem = (type, cost, title) => {

        const updatedArray = (array) => {

            function randomIntFromInterval(min, max) { // min and max included 
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

    const calculateEstimate = (arr) => {
        let estimate = 0
        arr.forEach(item => {
            estimate = estimate + Number(item.cost)
        })
        return estimate
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
                <LineItemsContainer type="Material" calculateEstimate={calculateEstimate} items={materialItems} createItem={createItem} updateItem={updateItems} deleteItem={deleteItem} />
                <LineItemsContainer type="Labor" calculateEstimate={calculateEstimate} items={laborItems} createItem={createItem} updateItem={updateItems} deleteItem={deleteItem}/>
                <LineItemsContainer type="Inclusive" calculateEstimate={calculateEstimate} items={inclusiveItems} createItem={createItem} updateItem={updateItems} deleteItem={deleteItem}/>
            </div>
        </div>
    );
}

function LineItemsContainer({ type, items, updateItem, calculateEstimate, createItem, deleteItem }){
    
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

    return (
        <div className="container-child">
            <h3>{type} Costs</h3>
            <button onClick={() => toggleModal(true)}>Add {type} Cost</button>
            <p>Total: {calculateEstimate(items)}</p>
            <ul>{renderLineItems()}</ul>    
            <ItemModal open={modalOpen} submit={addItemHandler} close={closeModal}/>
        </div>
    )
}

function LineItem({ item, type, update, deleteItem }){
    // const [title, setTitle] = useState("")
    // const [cost, setCost] = useState(0)
    const [editMode, toggleEditMode] = useState(false)

    const clickHandler = () => {
        // setTitle(item.title)
        // setCost(item.cost)
        toggleEditMode(!editMode)
    }

    // const titleChangeHandler = (e) => {
    //     setTitle(e.target.value)
    // }

    // const costChangeHandler = (e) => {
    //     setCost(e.target.value)
    // }

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


    // const renderModal = () => {
    //    return (
    //     <ReactModal
    //         isOpen={editMode}
    //         onRequestClose={closeModal}
    //         style={customStyles}
    //         contentLabel="Example Modal"
    //     >
    //         <div>
    //             <form onSubmit={submitHandler}>
    //                 <input
    //                 defaultValue={title}
    //                 onChange={titleChangeHandler} 
    //                 />
    //                 <input
    //                 defaultValue={cost}
    //                 onChange={costChangeHandler}  
    //                 type="number"
    //                 />
    //                 <button type="submit">Save</button>
    //             </form>
    //             <button onClick={closeModal}>close</button>
    //         </div>
    //     </ReactModal>   
    //    ) 
    // }

    return (
        <div>
        {editMode 
        ? 
            // renderModal()
            <ItemModal currentTitle={item.title} currentCost={item.cost} open={editMode} close={closeModal} submit={submitHandler}/>
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

export default Project;