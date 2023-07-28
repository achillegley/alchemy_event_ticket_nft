import {db} from '../firebase'
import { storeTicket } from './crudTicket';
import { useWeb3 } from '../contexts/Web3Context';

type TicketType = 'GOLD' | 'SILVER' | 'DEFAULT';
interface TicketOption {
    type: TicketType;
    places_limit: number;
    price:number;
  }
interface EventType{
    contract_address:string;
    period:string;
    title:string;
    place:string;
    deployer: string;
}

interface DataSnapshot {
    key: string;  // The key (name) of the location that generated this snapshot.
    val(): any;  // Extracts the data from the snapshot.
    exists(): boolean;  // Checks whether the snapshot contains any data.
    child(path: string): DataSnapshot;  // Gets a child DataSnapshot for the specific key or path.
    forEach(action: (childSnapshot: DataSnapshot) => boolean | void): boolean;  // Iterates through each child snapshot.
  }

export const storeEvent = async (event:EventType, tickets:TicketOption[])=>{
    db.ref('events').push({
        contract_address: event.contract_address,
        period:event.period,
        title:event.title,
        place:event.place,
        deployer: event.deployer
    }).then((snapshot)=>{
        console.log('Event stored sucess fully === ', snapshot.key);
        //let's save corresponding tyckets
        tickets.map((option:TicketOption)=>{
            storeTicket(snapshot?.key,option)
        })
    }).catch((error:'')=>{
        console.error('Error storing Event === ', error)
    })
}

export const readEvents= async()=>{
    return db.ref('events').once('value')
    .then((snapshot)=>{
        const events:{val:EventType,key:string}[]=[];
        snapshot.forEach((childSnapshot) =>{
            events.push({val:childSnapshot.val(), key:childSnapshot.key});
        });
        return events
    })
}