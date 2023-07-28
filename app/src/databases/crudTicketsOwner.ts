import {db} from '../firebase'


interface TicketOwner {
    contract_address: string;
    owner_adress: string;
}

interface DataSnapshot {
    key: string;  // The key (name) of the location that generated this snapshot.
    val(): any;  // Extracts the data from the snapshot.
    exists(): boolean;  // Checks whether the snapshot contains any data.
    child(path: string): DataSnapshot;  // Gets a child DataSnapshot for the specific key or path.
    forEach(action: (childSnapshot: DataSnapshot) => boolean | void): boolean;  // Iterates through each child snapshot.
  }

export const storeTicketOwner = async (ticketOwner:TicketOwner|null)=>{
    db.ref('ticketsOwners').push({
        contract_address:ticketOwner?.contract_address ,
        owner_adress:ticketOwner?.owner_adress
    }).then((snapshot)=>{
        console.log('Ticket owner stored successfully === ', snapshot.key);
    }).catch((error:'')=>{
        console.error('Error storing TicketOwner === ', error)
    })
}

export const readAllTicketOwners= async()=>{
    return db.ref('ticketsOwners').once('value')
    .then((snapshot)=>{
        const ticketsOwners:{val:TicketOwner,key:string}[]=[];
        snapshot.forEach((childSnapshot) =>{
            ticketsOwners.push({val:childSnapshot.val(), key:childSnapshot.key});
        });
        return ticketsOwners
    })
}