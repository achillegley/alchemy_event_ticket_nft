import {db} from '../firebase'

type TicketType = 'GOLD' | 'SILVER' | 'DEFAULT';
interface TicketOption {
    type: TicketType;
    places_limit: number;
    price:number
}

interface DataSnapshot {
    key: string;  // The key (name) of the location that generated this snapshot.
    val(): any;  // Extracts the data from the snapshot.
    exists(): boolean;  // Checks whether the snapshot contains any data.
    child(path: string): DataSnapshot;  // Gets a child DataSnapshot for the specific key or path.
    forEach(action: (childSnapshot: DataSnapshot) => boolean | void): boolean;  // Iterates through each child snapshot.
  }

export const storeTicket = async (eventRef:string|null,ticket:TicketOption|null)=>{
    db.ref('tickets').push({
        eventId: eventRef,
        type:ticket?.type,
        places_limit:ticket?.places_limit,
        price:ticket?.price
    }).then((snapshot)=>{
        console.log('Ticket stored sucess fully === ', snapshot.key);
    }).catch((error:'')=>{
        console.error('Error storing Event === ', error)
    })
}

export const readTickets= async(eventId:string)=>{
    const query= db.ref('tickets').orderByChild("eventId").equalTo(eventId);
    query.once("value",(snapshot)=>{
        const tickets:{val:TicketOption}[]=[];
        snapshot.forEach((childSnapshot) =>{
            tickets.push({val:childSnapshot.val()});
        });
        return tickets
    })
}

export const readAllTickets= async()=>{
    return db.ref('tickets').once('value')
    .then((snapshot)=>{
        const tickets:{val:{eventId:"",type: TicketType,places_limit: number, price:number},key:string}[]=[];
        snapshot.forEach((childSnapshot) =>{
            tickets.push({val:childSnapshot.val(), key:childSnapshot.key});
        });
        return tickets
    })
}