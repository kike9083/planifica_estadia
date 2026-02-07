'use client';

import { useState, useEffect, useCallback } from 'react';
import { account, databases, APPWRITE_CONFIG } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import { useAuth } from '@/context/AuthContext';

export interface Attendee {
    $id?: string;
    name: string;
    age: number;
    userId?: string;
    planId?: string;
}

export interface Plan {
    $id: string;
    nombre: string;
    descripcion?: string;
    tripDuration: number;
    nightPrice: number;
    baseCapacity?: number;     // Nueva capacidad base
    maxCapacity?: number;      // Capacidad máxima permitida
    extraPersonFee?: number;   // Recargo por persona extra
    calculationMethod?: 'socialized' | 'independent'; // Método de cálculo
    startDate?: string;
    userId: string;
}

export const useAppLogic = () => {
    const { user } = useAuth();
    const [attendees, setAttendees] = useState<Attendee[]>([]);
    const [loading, setLoading] = useState(true);
    const [simAdults, setSimAdults] = useState(0);
    const [tripDuration, setTripDuration] = useState(3);
    const [simulationPrice, setSimulationPrice] = useState<number | null>(null); // Para simulaciones temporales
    const [dbPrices, setDbPrices] = useState<any>(null);
    const [dbMenu, setDbMenu] = useState<any[]>([]);
    const [inventory, setInventory] = useState<any[]>([]);
    const [proteins, setProteins] = useState<any[]>([]);
    const [veggies, setVeggies] = useState<any[]>([]);

    // Multi-Plan State
    const [plans, setPlans] = useState<Plan[]>([]);
    const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);

    const loadData = useCallback(async () => {
        if (!user?.$id) return;

        try {
            setLoading(true);

            // 1. Cargar Planes del Usuario
            const plansRes = await databases.listDocuments(
                APPWRITE_CONFIG.DATABASE,
                'planificaciones',
                [Query.equal('userId', user.$id)]
            );

            let activePlan: Plan;

            if (plansRes.documents.length === 0) {
                // Crear plan inicial si no tiene ninguno
                const newPlan = await databases.createDocument(
                    APPWRITE_CONFIG.DATABASE,
                    'planificaciones',
                    ID.unique(),
                    {
                        userId: user.$id,
                        nombre: 'Planificación Inicial',
                        tripDuration: 3,
                        nightPrice: 150,
                        startDate: new Date().toISOString().split('T')[0]
                    }
                );
                activePlan = newPlan as unknown as Plan;
                setPlans([activePlan]);
            } else {
                const p = plansRes.documents as unknown as Plan[];
                setPlans(p);
                const lastId = localStorage.getItem(`last_plan_${user.$id}`);
                activePlan = p.find(pl => pl.$id === lastId) || p[0];
            }

            setCurrentPlan(activePlan);
            setTripDuration(activePlan.tripDuration);

            // 2. Cargar Asistentes filtrados por Plan
            const attendeesRes = await databases.listDocuments(
                APPWRITE_CONFIG.DATABASE,
                APPWRITE_CONFIG.COLLECTION,
                [
                    Query.equal('userId', user.$id),
                    Query.equal('planId', activePlan.$id),
                    Query.limit(100)
                ]
            );
            setAttendees(attendeesRes.documents as unknown as Attendee[]);

            // 3. Cargar Menú filtrado por Plan
            const menuRes = await databases.listDocuments(
                APPWRITE_CONFIG.DATABASE,
                'menu',
                [
                    Query.equal('userId', user.$id),
                    Query.equal('planId', activePlan.$id),
                    Query.limit(100)
                ]
            );
            setDbMenu(menuRes.documents);

            // 4. Cargar Precios Aislados por Usuario y Plan
            const [protRes, vivRes, vegRes] = await Promise.all([
                databases.listDocuments(APPWRITE_CONFIG.DATABASE, 'proteinas', [
                    Query.equal('userId', user.$id),
                    Query.equal('planId', activePlan.$id)
                ]),
                databases.listDocuments(APPWRITE_CONFIG.DATABASE, 'viveres', [
                    Query.equal('userId', user.$id),
                    Query.equal('planId', activePlan.$id),
                    Query.limit(100)
                ]),
                databases.listDocuments(APPWRITE_CONFIG.DATABASE, 'vegetales', [
                    Query.equal('userId', user.$id),
                    Query.equal('planId', activePlan.$id)
                ])
            ]);

            const mappedPrices: any = { meat: {}, super: {}, veggies: {}, lodgingBase: 430, extraPax: 20 };
            protRes.documents.forEach((d: any) => {
                const key = d.nombre.toLowerCase().replace(/\s+/g, '');
                mappedPrices.meat[key === 'costillodepuerco' ? 'costillaPuerco' : key] = d.precio;
            });
            vivRes.documents.forEach((d: any) => {
                const key = d.nombre.toLowerCase().replace(/\s+/g, '');
                mappedPrices.super[key === 'quesocrema' ? 'quesoCrema' : key === 'quesoblanco' ? 'quesoBlanco' : key] = d.precio;
            });
            vegRes.documents.forEach((d: any) => {
                const key = d.nombre.toLowerCase().replace(/\s+/g, '');
                mappedPrices.veggies[key === 'kitverdura' ? 'kitVerdura' : key] = d.precio;
            });

            setDbPrices(mappedPrices);
            setInventory(vivRes.documents);
            setProteins(protRes.documents);
            setVeggies(vegRes.documents);

        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    }, [user?.$id]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        if (!loading && currentPlan) {
            const confirmedPeople = attendees.filter(a => a.age > 5).length;
            const baseCap = currentPlan.baseCapacity || 10;

            // Inicializar simAdults para que el TOTAL coincida con la base (Personas que pagan)
            if (simAdults === 0) {
                setSimAdults(Math.max(confirmedPeople, baseCap));
            }
        }
    }, [loading, attendees.length, currentPlan?.$id, simAdults]);

    useEffect(() => {
        localStorage.setItem('attendees_backup', JSON.stringify(attendees));
    }, [attendees]);

    const addAttendee = async (name: string, age: number) => {
        if (!user || !currentPlan) return false;
        try {
            const response = await databases.createDocument(
                APPWRITE_CONFIG.DATABASE,
                APPWRITE_CONFIG.COLLECTION,
                ID.unique(),
                { name, age, userId: user.$id, planId: currentPlan.$id }
            );
            setAttendees(prev => [...prev, response as unknown as Attendee]);
            return true;
        } catch (error) {
            console.error('Error adding attendee:', error);
            return false;
        }
    };

    const removeAttendee = async (id: string) => {
        try {
            await databases.deleteDocument(
                APPWRITE_CONFIG.DATABASE,
                APPWRITE_CONFIG.COLLECTION,
                id
            );
            setAttendees(prev => prev.filter(a => a.$id !== id));
            return true;
        } catch (error) {
            console.error('Error removing attendee:', error);
            return false;
        }
    };

    const updateAttendee = async (id: string, name: string, age: number) => {
        try {
            await databases.updateDocument(
                APPWRITE_CONFIG.DATABASE,
                APPWRITE_CONFIG.COLLECTION,
                id,
                { name, age }
            );
            setAttendees(prev => prev.map(a => a.$id === id ? { ...a, name, age } : a));
            return true;
        } catch (error) {
            console.error('Error updating attendee:', error);
            return false;
        }
    };

    const stats = {
        people: attendees.filter(a => a.age > 5).length,
        free: attendees.filter(a => a.age <= 5).length,
        total: attendees.length
    };

    const getPortion = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes('costillón') || n.includes('puerco') || n.includes('costilla')) return 0.7;
        if (n.includes('rabo')) return 1.0;
        if (n.includes('pollo')) return 1.3;
        if (n.includes('carne')) return 0.6;
        if (n.includes('chorizo')) return 0.4;
        if (n.includes('yuca')) return 0.5;
        if (n.includes('plátano')) return 1.0;
        if (n.includes('limón')) return 2.0;
        if (n.includes('arroz')) return 0.25;
        if (n.includes('huevo')) return 2.0;
        if (n.includes('pan')) return 1.2;
        if (n.includes('tocino')) return 0.25;
        return 1.0;
    };

    const calculateBudget = (peopleCount: number, totalPax: number) => {
        const p = dbPrices || { meat: {}, super: {}, veggies: {} };
        const nights = Math.max(0, (currentPlan?.tripDuration || 3) - 1);

        // Priorizar el precio de simulación si existe
        const nightValue = simulationPrice !== null ? simulationPrice : (currentPlan?.nightPrice || 0);

        // Logica de capacidad y excedentes
        const baseCapacity = currentPlan?.baseCapacity || 10;
        const maxCapacity = currentPlan?.maxCapacity || 18;
        const extraFee = currentPlan?.extraPersonFee || 20;

        const totalToCharge = peopleCount; // Personas que cuentan para el límite (pagan)
        const overLimitCount = Math.max(0, totalToCharge - baseCapacity);
        const extraPeopleTotalCost = overLimitCount * extraFee * nights;

        const isOverMax = totalToCharge > maxCapacity;

        const lodgingBaseTotal = nights * nightValue;
        const totalLodgingToCover = lodgingBaseTotal + extraPeopleTotalCost;

        const pax = totalPax || 1;
        const menu = dbMenu || [];

        const getCalculatedQty = (name: string) => {
            const portion = getPortion(name);
            if (menu.length === 0) return pax * portion;

            const lowerName = name.toLowerCase();
            const count = menu.filter(m =>
                m.comida.toLowerCase().includes(lowerName) ||
                (m.descripcion && m.descripcion.toLowerCase().includes(lowerName))
            ).length;

            if (count === 0) {
                const isStaple = lowerName.includes('aceite') || lowerName.includes('sal') || lowerName.includes('snack') ||
                    lowerName.includes('kit') || lowerName.includes('harina') || lowerName.includes('queso') ||
                    lowerName.includes('mantequilla');
                return isStaple ? 1 : 0;
            }
            return count * pax * portion;
        };

        const calculateCatTotal = (items: any[]) => {
            return items.reduce((acc, item) => {
                const qty = item.cantidad > 0 ? item.cantidad : getCalculatedQty(item.nombre);
                return acc + (qty * (item.precio || 0));
            }, 0);
        };

        const proteinsTotal = calculateCatTotal(proteins);
        const veggiesTotal = calculateCatTotal(veggies);
        const inventoryTotal = calculateCatTotal(inventory);
        const miscTotal = menu.length > 0 ? 15.00 : 40.00;
        const foodTotal = proteinsTotal + veggiesTotal + inventoryTotal + miscTotal;

        const isIndependent = currentPlan?.calculationMethod === 'independent';

        // La división depende del método de cálculo
        const housePerPerson = isIndependent
            ? (baseCapacity > 0 ? (lodgingBaseTotal / baseCapacity) : 0)
            : (peopleCount > 0 ? (totalLodgingToCover / peopleCount) : 0);

        const foodPerPerson = peopleCount > 0 ? (foodTotal / peopleCount) : 0;
        const extraFeePerPerson = extraFee * nights;

        return {
            lodgingTotal: totalLodgingToCover,
            lodgingBaseTotal,
            extraPeopleTotalCost,
            nights,
            nightValue,
            foodTotal,
            foodBreakdown: {
                proteins: proteinsTotal,
                veggies: veggiesTotal,
                inventory: inventoryTotal,
                misc: miscTotal
            },
            totalLodgingToCover,
            housePerPerson,
            foodPerPerson,
            extraFeePerPerson,
            totalPerPerson: housePerPerson + foodPerPerson,
            peopleUsed: peopleCount,
            overLimitCount,
            isOverMax,
            maxCapacity,
            baseCapacity,
            isIndependent
        };
    };

    const saveOperation = async () => {
        if (!user || !currentPlan) return false;
        try {
            const currentBudget = calculateBudget(stats.people, stats.total);
            const data = {
                pax: stats.total,
                presupuesto_total: currentBudget.totalPerPerson * stats.people,
                userId: user.$id,
                planId: currentPlan.$id,
                detalles_json: JSON.stringify({
                    stats,
                    budget: currentBudget,
                    prices: dbPrices,
                    timestamp: new Date().toISOString()
                })
            };

            await databases.createDocument(APPWRITE_CONFIG.DATABASE, 'operaciones', ID.unique(), data);
            return true;
        } catch (error) {
            console.error('Error saving operation:', error);
            return false;
        }
    };

    const saveMenu = async (menuItem: any) => {
        if (!user || !currentPlan) return false;
        try {
            const data = {
                dia: menuItem.dia,
                comida: menuItem.comida,
                descripcion: menuItem.descripcion,
                categoria: menuItem.categoria,
                userId: user.$id,
                planId: currentPlan.$id
            };

            if (menuItem.$id) {
                await databases.updateDocument(APPWRITE_CONFIG.DATABASE, 'menu', menuItem.$id, data);
            } else {
                await databases.createDocument(APPWRITE_CONFIG.DATABASE, 'menu', ID.unique(), data);
            }
            loadData();
            return true;
        } catch (error) {
            console.error("Error saving menu:", error);
            return false;
        }
    };

    const saveInventoryItem = async (item: any) => {
        if (!user || !currentPlan) return false;
        try {
            const data = {
                nombre: item.nombre,
                precio: parseFloat(item.precio),
                unidad: item.unidad,
                userId: user.$id,
                planId: currentPlan.$id
            };

            if (item.$id) {
                await databases.updateDocument(APPWRITE_CONFIG.DATABASE, 'viveres', item.$id, data);
            } else {
                await databases.createDocument(APPWRITE_CONFIG.DATABASE, 'viveres', ID.unique(), data);
            }
            loadData();
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const deleteDocument = async (collectionId: string, id: string) => {
        try {
            await databases.deleteDocument(APPWRITE_CONFIG.DATABASE, collectionId, id);
            loadData();
            return true;
        } catch (error) {
            console.error(`Error deleting from ${collectionId}:`, error);
            return false;
        }
    };

    // Keep aliases for compatibility with current components
    const deleteInventoryItem = (collId: string, id: string) => deleteDocument(collId, id);
    const deletePriceItem = (collId: string, id: string) => deleteDocument(collId, id);

    const updatePrice = async (collectionId: string, documentId: string, newPrice: number) => {
        try {
            await databases.updateDocument(APPWRITE_CONFIG.DATABASE, collectionId, documentId, { precio: newPrice });
            loadData();
            return true;
        } catch (error) {
            console.error('Error updating price:', error);
            return false;
        }
    };

    const addPriceItem = async (collectionId: string, item: any) => {
        if (!user || !currentPlan) return false;
        try {
            await databases.createDocument(
                APPWRITE_CONFIG.DATABASE,
                collectionId,
                ID.unique(),
                {
                    nombre: item.nombre,
                    precio: parseFloat(item.precio),
                    unidad: item.unidad || 'Unidad',
                    userId: user.$id,
                    planId: currentPlan.$id
                }
            );
            loadData();
            return true;
        } catch (error) {
            console.error('Error adding price item:', error);
            return false;
        }
    };



    const createPlan = async (nombre: string) => {
        if (!user) return null;
        try {
            const newPlan = await databases.createDocument(
                APPWRITE_CONFIG.DATABASE,
                'planificaciones',
                ID.unique(),
                {
                    userId: user.$id,
                    nombre,
                    tripDuration: 3,
                    nightPrice: 215,
                    baseCapacity: 10,
                    maxCapacity: 18,
                    extraPersonFee: 20,
                    startDate: new Date().toISOString().split('T')[0]
                }
            );
            setPlans(prev => [...prev, newPlan as unknown as Plan]);
            return newPlan as unknown as Plan;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const selectPlan = (plan: Plan) => {
        if (user) {
            localStorage.setItem(`last_plan_${user.$id}`, plan.$id);
            setCurrentPlan(plan);
            loadData();
        }
    };

    const updatePlanConfig = async (config: {
        duration?: number,
        nightPrice?: number,
        startDate?: string,
        baseCapacity?: number,
        maxCapacity?: number,
        extraPersonFee?: number,
        calculationMethod?: 'socialized' | 'independent'
    }) => {
        if (!currentPlan) return false;
        try {
            const data: any = {};
            if (config.duration !== undefined) data.tripDuration = config.duration;
            if (config.nightPrice !== undefined) data.nightPrice = config.nightPrice;
            if (config.startDate !== undefined) data.startDate = config.startDate;
            if (config.baseCapacity !== undefined) data.baseCapacity = config.baseCapacity;
            if (config.maxCapacity !== undefined) data.maxCapacity = config.maxCapacity;
            if (config.extraPersonFee !== undefined) data.extraPersonFee = config.extraPersonFee;
            if (config.calculationMethod !== undefined) data.calculationMethod = config.calculationMethod;

            await databases.updateDocument(APPWRITE_CONFIG.DATABASE, 'planificaciones', currentPlan.$id, data);
            if (config.duration !== undefined) setTripDuration(config.duration);
            const updatedPlan = { ...currentPlan, ...data };
            setCurrentPlan(updatedPlan);
            setPlans(prev => prev.map(p => p.$id === currentPlan.$id ? updatedPlan : p));
            return true;
        } catch (error: any) {
            console.error('Error updating plan config:', error);
            return false;
        }
    };

    const deletePlan = async (id: string) => {
        try {
            await databases.deleteDocument(APPWRITE_CONFIG.DATABASE, 'planificaciones', id);
            setPlans(prev => prev.filter(p => p.$id !== id));
            if (currentPlan?.$id === id) {
                const remaining = plans.filter(p => p.$id !== id);
                if (remaining.length > 0) selectPlan(remaining[0]);
                else setCurrentPlan(null);
            }
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const updateProductQty = async (collId: string, id: string, cantidad: number) => {
        try {
            await databases.updateDocument(APPWRITE_CONFIG.DATABASE, collId, id, { cantidad });
            if (collId === 'proteinas') setProteins(prev => prev.map(p => p.$id === id ? { ...p, cantidad } : p));
            if (collId === 'viveres') setInventory(prev => prev.map(p => p.$id === id ? { ...p, cantidad } : p));
            if (collId === 'vegetales') setVeggies(prev => prev.map(p => p.$id === id ? { ...p, cantidad } : p));
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const renamePlan = async (id: string, newName: string) => {
        try {
            await databases.updateDocument(APPWRITE_CONFIG.DATABASE, 'planificaciones', id, { nombre: newName });
            setPlans(prev => prev.map(p => p.$id === id ? { ...p, nombre: newName } : p));
            if (currentPlan?.$id === id) setCurrentPlan({ ...currentPlan, nombre: newName });
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    return {
        attendees,
        loading,
        simAdults,
        setSimAdults,
        simulationPrice,
        setSimulationPrice,
        addAttendee,
        removeAttendee,
        updateAttendee,
        calculateBudget,
        saveOperation,
        saveMenu,
        stats,
        prices: dbPrices || { meat: {}, super: {}, veggies: {} },
        menu: dbMenu,
        tripDuration,
        inventory,
        proteins,
        veggies,
        saveInventoryItem,
        deleteInventoryItem,
        updatePrice,
        addPriceItem,
        deletePriceItem,
        plans,
        currentPlan,
        createPlan,
        selectPlan,
        updatePlanConfig,
        deletePlan,
        renamePlan,
        updateProductQty
    };
};
