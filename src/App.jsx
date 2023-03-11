import { useState, useEffect } from 'react'
import { db } from './firebase/db'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
} from 'firebase/firestore'
import { async } from '@firebase/util'

function App() {
  const [list, setList] = useState([])
  const [itemName, setItemName] = useState('')
  const [person, setPerson] = useState('select')
  const [password, setPassword] = useState('')
  const [isPasswordCorrect, setPasswordCorrect] = useState(false)

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "shopping-items"), (snapshot) => {
      setList(snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })).sort((a, b) => {
        if (a.date > b.date) return 1;
        else return -1
      }))
    });

    return () => unsubscribe()
  }, [])

  const addElement = async (e) => {
    if (itemName != '' && person != 'select' && await controlPassword(e)) {
      addDoc(collection(db, "shopping-items"), {
        name: itemName,
        person: person[0].toUpperCase() + person.substring(1),
        date: new Date()
      })
      setItemName('')
    } else {
      alert("Parola yanlış veya bir yeri boş bıraktınız!")
    }
    e.preventDefault()
  }

  const deleteAll = async () => {
    if (await controlPassword()) {
      list.forEach(item => {
        deleteItem(item.id)
      })
    } else {
      alert("Silmek için doğru parolayı girin!")
    }
  }

  const deleteItem = async (id) => {
    if (await controlPassword()) {
      deleteDoc(doc(db, "shopping-items", id))
    } else {
      alert("Silmek için doğru parolayı girin!")
    }
  }

  const controlPassword = async (e) => {
    if (!isPasswordCorrect) {
      if (e) e.preventDefault();

      const response = await fetch("/api/handler", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "password": password || "test"
        }
      })

      const data = await response.json()
      setPasswordCorrect(data.isPasswordCorrect)
      return data.isPasswordCorrect;
    } else {
      return true
    }
  }

  const handlePassword = (e) => {
    setPassword(e.target.value)
    setPasswordCorrect(false)
  }

  return (
    <div className="container mx-auto flex justify-center flex-col items-center p-8">
      <h1 className="text-2xl font-bold">603 Shopping List</h1>
      <div className="w-full mt-4 md:mt-12 flex flex-col md:flex-row justify-center items-center md:items-start">
        <form
          onSubmit={addElement}
          className="m-4 w-full md:w-1/2 flex justify-center items-center flex-col"
        >
          <input
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            type="text" placeholder="İhtiyaç" className="p-2 w-full md:w-3/4 border-2 border-gray-400 rounded-lg m-2"
          />
          <select
            onChange={(e) => setPerson(e.target.value)}
            value={person}
            className="form-select appearance-none block p-2 w-full md:w-3/4 border-2 border-gray-400 rounded-lg m-2"
          >
            <option value="select">Kimsin?</option>
            <option value="kutluhan">Kutluhan</option>
            <option value="kaan">Kaan</option>
            <option value="erdem">Erdem</option>
          </select>
          <input
            value={password}
            onChange={handlePassword}
            type="text" placeholder="Çok Gizli Oda 603 Parolası" className="p-2 w-full md:w-3/4 border-2 border-gray-400 rounded-lg m-2"
          />
          <button className="p-2 w-full md:w-3/4 bg-blue-500 rounded-lg m-2 text-white ">Ekle</button>
        </form>
        <div className="w-full md:w-1/2 flex flex-col justify-start items-center">
          <h2 className="text-xl font-bold">
            Listede Olanlar
          </h2>
          <span
            onClick={deleteAll}
            className="text-red-600  text-sm font-normal cursor-pointer"
          >
            (Listeyi Temizle)
          </span>
          <ul className="mt-4 flex justify-center items-center flex-col ">
            {list.map((item) => (
              <li className="list-decimal" key={item.id}>
                {item.name} ({item.person})
                <span
                  onClick={() => deleteItem(item.id)}
                  className="text-red-600 text-sm font-normal cursor-pointer"
                >
                  (Sil)
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div >
  )
}

export default App
