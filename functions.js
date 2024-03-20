import { API_KEY, API_TOKEN, TRELLO_ID } from "@env";
import axios from "axios";

//                //
// Main functions //
//                //

// Get all the tasks
// Récupérer toutes les tâches
export const getAllTasks = async () => {
  try {
    const response = await axios.get(
      `https://api.trello.com/1/boards/${TRELLO_ID}/cards/?key=${API_KEY}&token=${API_TOKEN}`
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches :", error);
    throw error;
  }
};

// Get all members of the card
// Récupérer les membres d'une carte
export const getCardMembers = async (idCards) => {
  try {
    const response = await axios.get(
      `https://api.trello.com/1/cards/${idCards}/members?key=${API_KEY}&token=${API_TOKEN}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des membres de la carte :",
      error
    );
    throw error;
  }
};

// Post a new member to the card
// Ajouter un membre à une carte
export const postCardMember = async (id, idMember) => {
  try {
    const response = await axios.post(
      `https://api.trello.com/1/cards/${id}/idMembers?value=${idMember}&key=${API_KEY}&token=${API_TOKEN}`
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout du membre à la carte :", error);
    throw error;
  }
};

// Get all lists names
// Récupérer tous les noms des listes
export const getAllListNames = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://api.trello.com/1/boards/${TRELLO_ID}/lists/?key=${API_KEY}&token=${API_TOKEN}`
      )
      .then((response) => {
        const listNames = response.data.map((list) => list.name);
        resolve(listNames);
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des noms des listes :",
          error
        );
        reject(error);
      });
  });
};

// Create a new list
// Créer une nouvelle liste
export const postNewList = async (boardId, name) => {
  try {
    const response = await axios.post(
      `https://api.trello.com/1/lists?name=${name}&idBoard=${boardId}&key=${API_KEY}&token=${API_TOKEN}`
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de la liste :", error);
    throw error;
  }
};

export const getAllListsFromBoard = async (boardId) => {
  try {
    const response = await axios.get(
      `https://api.trello.com/1/boards/${boardId}/lists?key=${API_KEY}&token=${API_TOKEN}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des listes getAllListsFromBoard :",
      error
    );
    throw error;
  }
};

export const getAllLists = async (idOrganization) => {
  try {
    // Get all boards from the specific organization
    const boardsResponse = await axios.get(
      `https://api.trello.com/1/organizations/${idOrganization}/boards?key=${API_KEY}&token=${API_TOKEN}`
    );

    // Get all lists from each board
    let lists = [];
    for (const board of boardsResponse.data) {
      const listsResponse = await axios.get(
        `https://api.trello.com/1/boards/${board.id}/lists?key=${API_KEY}&token=${API_TOKEN}`
      );
      lists = [...lists, ...listsResponse.data];
    }

    return lists;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des listes  getAllLists:",
      error
    );
    throw error;
  }
};

// Create a new card
// Créer une nouvelle carte
export const postNewCard = async (idList, name, desc) => {
  desc = encodeURIComponent(desc); // Encode the description to be URL-safe
  try {
    const response = await axios.post(
      `https://api.trello.com/1/cards?idList=${idList}&name=${name}&desc=${desc}&key=${API_KEY}&token=${API_TOKEN}`
    );

    const idCard = response.data.id;

    const checkListResponse = await axios.post(
      `https://api.trello.com/1/checklists?idCard=${idCard}&name=Checklist&key=${API_KEY}&token=${API_TOKEN}`
    );

    return { card: response.data, checklist: checkListResponse.data };
  } catch (error) {
    console.error("Erreur lors de la création de la carte :", error);
    throw error;
  }
};

// Delete a card
// Supprimer une carte
export const deleteCard = async (id) => {
  try {
    const response = await axios.delete(
      `https://api.trello.com/1/cards/${id}?key=${API_KEY}&token=${API_TOKEN}`
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la suppression de la carte :", error);
    throw error;
  }
};

export const archiveList = async (id) => {
  try {
    const response = await axios.put(
      `https://api.trello.com/1/lists/${id}?key=${API_KEY}&token=${API_TOKEN}&closed=true`
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'archivage de la liste :", error);
    throw error;
  }
};

export const UpdateList = async (id, name) => {
  try {
    const response = await axios.put(
      `https://api.trello.com/1/lists/${id}?key=${API_KEY}&token=${API_TOKEN}&name=${name}`
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la modification de la liste :", error);
    throw error;
  }
};

export const getCardsFromListName = async (listName, idOrganization) => {
  try {
    // Get all lists
    const lists = await getAllLists(idOrganization);

    // Find the list with the given name
    const list = lists.find((list) => list.name === listName);
    if (!list) {
      throw new Error(`No list found with name ${listName}`);
    }

    // Get the cards of the list
    const response = await axios.get(
      `https://api.trello.com/1/lists/${list.id}/cards?key=${API_KEY}&token=${API_TOKEN}`
    );

    // Map the response to a list of card objects with id, name, and desc
    const cards = await Promise.all(
      response.data.map(async (card) => {
        // Get the checklists of the card
        const checklistsResponse = await axios.get(
          `https://api.trello.com/1/cards/${card.id}/checklists?key=${API_KEY}&token=${API_TOKEN}`
        );

        // Map the checklists to a list of todos
        let todos = [];
        checklistsResponse.data.forEach((checklist) => {
          const checklistTodos = checklist.checkItems.map((item) => ({
            idCheckItem: item.id,
            title: item.name,
            completed: item.state === "complete",
            idChecklist: checklist.id,
          }));
          todos = [...todos, ...checklistTodos];
        });

        return {
          id: card.id,
          name: card.name,
          color: card.desc.replace(/`/g, ""), // Remove the extra quotes and backticks
          todos: todos,
        };
      })
    );

    return cards;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des cartes getCardsFromListName :",
      error
    );
    throw error;
  }
};

// Update a card name
// Mettre à jour le nom d'une carte
export const updateCardName = async (id, name) => {
  try {
    const response = await axios.put(
      `https://api.trello.com/1/cards/${id}?name=${name}&key=${API_KEY}&token=${API_TOKEN}`
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du nom de la carte :", error);
    throw error;
  }
};

// Update a card description
// Mettre à jour la description d'une carte
export const updateCardDesc = async (id, desc) => {
  desc = encodeURIComponent(desc);
  try {
    const response = await axios.put(
      `https://api.trello.com/1/cards/${id}?desc=${desc}&key=${API_KEY}&token=${API_TOKEN}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour de la description de la carte :",
      error
    );
    throw error;
  }
};

export const updateCardState = async (
  idCard,
  idChecklist,
  idCheckItem,
  state
) => {
  try {
    const response = await axios.put(
      `https://api.trello.com/1/cards/${idCard}/checklist/${idChecklist}/checkItem/${idCheckItem}/state?key=${API_KEY}&token=${API_TOKEN}`,
      { value: state }
    );
    return response.data;
  } catch (error) {
    console.error(
      console.log(
        "idCard :",
        idCard,
        "idCheckList :",
        idChecklist,
        "idCheckItem",
        idCheckItem,
        "State",
        state
      ),
      "Erreur lors de la mise à jour de la state de la checklist :",
      error
    );
    throw error;
  }
};

// Update a card list
// Mettre à jour la liste d'une carte
export const updateCardList = async (id, idList) => {
  try {
    const response = await axios.put(
      `https://api.trello.com/1/cards/${id}?idList=${idList}&key=${API_KEY}&token=${API_TOKEN}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour de la liste de la carte :",
      error
    );
    throw error;
  }
};

export const getChecklistId = async (idCard) => {
  try {
    const response = await axios.get(
      `https://api.trello.com/1/cards/${idCard}/checklists?key=${API_KEY}&token=${API_TOKEN}`
    );
    return response.data[0].id; // Assuming the checklist ID is in the first checklist object
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'ID de la checklist :",
      error
    );
    throw error;
  }
};

// Update the card to closed
// Mettre la carte en fermée
export const closeCard = async (id) => {
  try {
    const response = await axios.put(
      `https://api.trello.com/1/cards/${id}?closed=true&key=${API_KEY}&token=${API_TOKEN}`
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la fermeture de la carte :", error);
    throw error;
  }
};

//                      //
// Additional functions //
//                      //

// Get the board Members
export const getBoardMembers = async () => {
  const response = await axios.get(
    `https://api.trello.com/1/boards/${TRELLO_ID}/members/?key=${API_KEY}&token=${API_TOKEN}`
  );
  return response.data;
};

// Get all boards annd check if boards are part of an organisation
// Récupérer tous les boards et vérifier si les boards font partie d'une organisation
export const getAllBoards = async (idOrganisation) => {
  try {
    const response = await axios.get(
      `https://api.trello.com/1/members/me/boards?key=${API_KEY}&token=${API_TOKEN}`
    );
    if (!response.data || response.data.length === 0) {
      console.log("No boards found");
      return [];
    }

    // Filter the boards to only include those that are part of the organisation
    // Filtrez les tableaux pour inclure uniquement ceux qui font partie de l'organisation
    for (let i = 0; i < response.data.length; i++) {
      const board = response.data[i];
      if (board.idOrganization !== idOrganisation) {
        response.data.splice(i, 1);
        i--;
      }
    }

    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des boards :", error);
    throw error;
  }
};

export const updateBoard = async (idBoard, name) => {
  try{
    const response = await axios.get(
      'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken&name=${name}'
    );
    return response.data;
  } catch (error){
    console.error("Erreur lors de l'update du board")
    throw error;
  }
};

export const createBoard = async (name, idOrganization) => {
  try{
    const response = await axios.get(
      'https://api.trello.com/1/boards/?name={name}&key=APIKey&token=APIToken&idOrganization=${idOrganization}'
    );
    return response.data;
  } catch (error){
    console.error("Erreur lors de la création du Board")
    throw error;
  }
};

export const deleteBoard = async (idBoard) => {
  try{
    const response = await axios.get (
      'https://api.trello.com/1/boards/{id}?key=APIKey&token=APIToken'
    );
    return response.data;
  }catch (error){
    console.error("Erreur lors du delete du Board")
    throw error;
  }
};


// Get all Organizations
// Récupérer toutes les organisations
export const getAllOrganisations = async () => {
  try {
    const response = await axios.get(
      `https://api.trello.com/1/members/me/organizations?key=${API_KEY}&token=${API_TOKEN}`
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des organisations :", error);
    throw error;
  }
};

// Delete an Organisation
// Supprimer une organisation
export const deleteOrganisation = async (id) => {
  try {
    const response = await axios.delete(
      `https://api.trello.com/1/organizations/${id}?key=${API_KEY}&token=${API_TOKEN}`
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la suppression de l'organisation :", error);
    throw error;
  }
};

// Update an Organisation
// Mettre à jour une organisation
export const updateOrganisation = async (id, displayName) => {
  try {
    const response = await axios.put(
      `https://api.trello.com/1/organizations/${id}?displayName=${displayName}&key=${API_KEY}&token=${API_TOKEN}`
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'organisation :", error);
    throw error;
  }
};

// Create a new Organisation
// Créer une nouvelle organisation
export const postNewOrganisation = async (displayName, name, desc, website) => {
  try {
    const response = await axios.post(
      `https://api.trello.com/1/organizations?displayName=${displayName}&name=${name}&desc=${desc}&website=${website}&key=${API_KEY}&token=${API_TOKEN}`
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de l'organisation :", error);
    throw error;
  }
};

// Get all lists from a specific board
// Récupérer toutes les listes d'un tableau spécifique
export const getListsFromBoard = async (boardId) => {
  try {
    const response = await axios.get(
      `https://api.trello.com/1/boards/${boardId}/lists?key=${API_KEY}&token=${API_TOKEN}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des listes getListsFromBoard:",
      error
    );
    throw error;
  }
};

// Avoir toute les infos d'une list avec son nom
export const getIdListByName = async (name, boardId) => {
  try {
    const response = await axios.get(
      `https://api.trello.com/1/boards/${boardId}/lists?key=${API_KEY}&token=${API_TOKEN}`
    );

    const list = response.data.find((list) => list.name === name);
    if (!list) {
      throw new Error(`No list found with name ${name}`);
    } else {
      return list.id;
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'id de la liste :",
      error
    );
    throw error;
  }
};

export const deleteTaskOfCard = async (idChecklist, idChecListkItem) => {
  try {
    const response = await axios.delete(
      `https://api.trello.com/1/checklists/${idChecklist}/checkItems/${idChecListkItem}?key=${API_KEY}&token=${API_TOKEN}`
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la suppression de la tâche :", error);
    throw error;
  }
};

export const addCheckListItem = async (itemName, idChecklist) => {
  try {
    const response = await axios.post(
      `https://api.trello.com/1/checklists/${idChecklist}/checkItems?name=${itemName}&key=${API_KEY}&token=${API_TOKEN}`
    );
    return response.data;
  } catch (error) {
    console.log("Erreur lors de l'ajout d'un checkListItem", error);
    throw error;
  }
};

export const getAllMemberOfBoard = async (boardId) => {
  try {
    const response = await axios.get(
      `https://api.trello.com/1/boards/${boardId}/members?key=${API_KEY}&token=${API_TOKEN}`
    );
    return response.data;
  } catch (error) {
    console.log("Erreur lors de la récupération des membres du board", error);
    throw error;
  }
};

export const removeMemberFromCard = async (idCard, idMember) => {
  try {
    const response = await axios.delete(
      `https://api.trello.com/1/cards/${idCard}/idMembers/${idMember}?key=${API_KEY}&token=${API_TOKEN}`
    );
    return response.data;
  } catch {
    console.log("Erreur lors de la suppression du membre de la carte", error);
    throw error;
  }
};
