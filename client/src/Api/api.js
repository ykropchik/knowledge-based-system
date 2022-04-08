import axios from "axios";
import { API_BASE_URL } from "./configuration";

export async function fetchPriceClasses() {
    try {
        const response = await axios.get(`${API_BASE_URL}/priceClasses/get`);
        return response.data;
    } catch (error) {
        throw error.response;
    }
}

export async function createClass(newClass) {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/priceClasses/add`,
            newClass
        );
        return response.data;
    } catch (error) {
        throw error.response;
    }
}

export async function removeClass(classId) {
    try {
        const response = await axios.delete(
            `${API_BASE_URL}/priceClasses/remove/${classId}`
        );
        return response.data;
    } catch (error) {
        throw error.response;
    }
}

export async function setAttributesToPriceClass(classId, idArray) {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/priceClasses/${classId}/setAttributes`,
            { attributesId: idArray }
        );
        return response.data;
    } catch (error) {
        throw error.response;
    }
}

export async function fetchAttributes() {
    try {
        const response = await axios.get(`${API_BASE_URL}/attributes/get`);
        return response.data;
    } catch (error) {
        throw error.response;
    }
}

export async function createAttribute(newAttribute) {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/attributes/add`,
            newAttribute
        );
        return response.data;
    } catch (error) {
        throw error.response;
    }
}

export async function removeAttribute(attributeId) {
    try {
        const response = await axios.delete(
            `${API_BASE_URL}/attributes/remove/${attributeId}`
        );
        return response.data;
    } catch (error) {
        throw error.response;
    }
}

export async function setAttributeValues(attributeId, data) {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/attributes/setValues/${attributeId}`,
            data
        );
        return response.data;
    } catch (error) {
        throw error.response;
    }
}

export async function setPriceClassAttributesValues(data) {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/priceClassAttribute/setValues`,
            data
        );
        return response.data;
    } catch (error) {
        throw error.response;
    }
}

export async function solveClassification(data) {
    try {
        const response = await axios.post(`${API_BASE_URL}/solver`, data);
        return response.data;
    } catch (error) {
        throw error.response;
    }
}

export async function checkCompleteness() {
    try {
        const response = await axios.get(`${API_BASE_URL}/knowledge/checkCompleteness`);
        return response.data;
    } catch (error) {
        throw error.response;
    }
}
