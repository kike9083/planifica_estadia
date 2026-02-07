'use client';

import React, { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import { Attendee, Plan } from '@/hooks/useAppLogic';

interface TripSummaryProps {
    currentPlan: Plan | null;
    stats: {
        people: number;
        free: number;
        total: number;
    };
    budget: any;
    attendees: Attendee[];
    menu: any[];
}

export const TripSummary = ({ currentPlan, stats, budget, attendees, menu }: TripSummaryProps) => {
    const [isExporting, setIsExporting] = useState(false);

    const generatePDF = () => {
        if (!currentPlan) return;
        setIsExporting(true);

        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            let y = 20;

            // 1. TÍTULO Y ENCABEZADO
            doc.setFillColor(15, 23, 42); // Navy Blue
            doc.rect(0, 0, pageWidth, 40, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.setFont('helvetica', 'bold');
            doc.text(currentPlan.nombre.toUpperCase(), pageWidth / 2, 22, { align: 'center' });

            doc.setFontSize(10);
            const subHeader = `${currentPlan.startDate || 'Pendiente'}  |  ${currentPlan.tripDuration} Días / ${Math.max(0, currentPlan.tripDuration - 1)} Noches`;
            doc.text(subHeader, pageWidth / 2, 32, { align: 'center' });

            y = 55;
            doc.setTextColor(30, 41, 59);

            // 2. LOGÍSTICA Y COSTOS
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('RESUMEN DE COSTOS', 20, y);
            y += 8;
            doc.setDrawColor(226, 232, 240);
            doc.line(20, y, pageWidth - 20, y);
            y += 10;

            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.text('Cuota por Persona:', 20, y);
            doc.setFont('helvetica', 'bold');
            doc.text(`$${(budget?.totalPerPerson || 0).toFixed(2)}`, pageWidth - 20, y, { align: 'right' });

            y += 8;
            doc.setFont('helvetica', 'normal');
            doc.text('  - Hospedaje (inc. excedentes):', 20, y);
            doc.text(`$${(budget?.housePerPerson || 0).toFixed(2)}`, pageWidth - 20, y, { align: 'right' });

            y += 8;
            doc.text('  - Alimentación:', 20, y);
            doc.text(`$${(budget?.foodPerPerson || 0).toFixed(2)}`, pageWidth - 20, y, { align: 'right' });

            if (budget?.extraPeopleTotalCost > 0) {
                y += 8;
                doc.setTextColor(180, 83, 9); // Amber
                doc.setFont('helvetica', 'italic');
                doc.text(`* Incluye recargo por ${budget.overLimitCount} personas extra`, 20, y);
                doc.setTextColor(30, 41, 59);
                doc.setFont('helvetica', 'normal');
            }

            y += 15;

            // 3. EL GRUPO
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('ESTADÍSTICAS DEL GRUPO', 20, y);
            y += 8;
            doc.line(20, y, pageWidth - 20, y);
            y += 10;

            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.text(`Total de personas confirmadas: ${stats.total}`, 20, y);
            y += 8;
            doc.text(`Personas (Pagan): ${stats.people}  |  Niños Gratis (<5): ${stats.free}`, 20, y);

            y += 15;

            // 4. LISTA DE CONFIRMADOS (2 Columnas)
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('LISTA DE VIAJEROS', 20, y);
            y += 8;
            doc.line(20, y, pageWidth - 20, y);
            y += 10;

            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');

            let startX = 20;
            let col = 0;
            attendees.forEach((p, index) => {
                const posX = col === 0 ? 25 : pageWidth / 2 + 5;
                const text = `• ${p.name} (${p.age >= 5 ? 'Persona' : 'Gratis'})`;
                doc.text(text, posX, y);

                if (col === 1) {
                    y += 7;
                    col = 0;
                } else {
                    col = 1;
                }

                // Salto de página si es necesario
                if (y > doc.internal.pageSize.getHeight() - 20) {
                    doc.addPage();
                    y = 20;
                }
            });

            if (col === 1) y += 10; else y += 5;

            // 5. MENÚ (Si existe)
            if (menu.length > 0) {
                if (y > doc.internal.pageSize.getHeight() - 60) {
                    doc.addPage();
                    y = 20;
                }

                y += 5;
                doc.setFontSize(14);
                doc.setFont('helvetica', 'bold');
                doc.text('MENÚ PLANIFICADO', 20, y);
                y += 8;
                doc.line(20, y, pageWidth - 20, y);
                y += 10;

                doc.setFontSize(9);
                doc.setFont('helvetica', 'normal');
                menu.slice(0, 10).forEach(item => {
                    const splitText = doc.splitTextToSize(`• ${item.comida}`, pageWidth - 40);
                    doc.text(splitText, 25, y);
                    y += (splitText.length * 5);
                });
            }

            // PIE DE PÁGINA
            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139);
            doc.text('Generado por Planifica Estadía ProMax', pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });

            doc.save(`Planificacion_${currentPlan.nombre.replace(/\s+/g, '_')}.pdf`);
        } catch (error) {
            console.error(error);
            alert('Error al generar el PDF.');
        } finally {
            setIsExporting(false);
        }
    };

    if (!currentPlan) return null;

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in pb-32 px-4">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 md:p-12 text-center space-y-8 shadow-2xl">
                <div className="w-20 h-20 bg-sky-500/10 border border-sky-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText className="text-sky-400" size={40} />
                </div>

                <div className="space-y-4">
                    <h2 className="text-3xl font-black text-white tracking-tighter">Todo Listo para Exportar</h2>
                    <p className="text-slate-400 max-w-lg mx-auto leading-relaxed">
                        He simplificado el resumen para que el PDF sea 100% legible y contenga toda la logística necesaria para el grupo. No más desorden visual.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto pt-4">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 text-left">
                        <p className="text-[10px] font-black uppercase text-sky-400 tracking-widest mb-1">Viaje</p>
                        <p className="text-lg font-bold text-white truncate">{currentPlan.nombre}</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 text-left">
                        <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest mb-1">Confirmados</p>
                        <p className="text-lg font-bold text-white">{stats.total} personas</p>
                    </div>
                </div>

                <button
                    onClick={generatePDF}
                    disabled={isExporting}
                    className="mt-8 flex items-center gap-3 px-10 py-5 bg-sky-500 hover:bg-sky-400 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-sky-500/20 active:scale-95 disabled:opacity-50 mx-auto"
                >
                    {isExporting ? 'GENERANDO...' : 'DESCARGAR PDF'}
                    {!isExporting && <Download size={24} />}
                </button>
            </div>
        </div>
    );
};
