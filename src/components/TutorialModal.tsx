import React, { useState } from 'react';
import {
    X,
    ChevronRight,
    ChevronLeft,
    Settings,
    Users,
    ShoppingCart,
    PieChart,
    CheckCircle2,
    Sparkles,
    UtensilsCrossed
} from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { Button } from './ui/Button';

interface TutorialModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const steps = [
    {
        title: "Planifica Más, Estrésate Menos",
        description: "Dile adiós al caos de los chats interminables y las hojas de cálculo. Hemos diseñado esta herramienta para que resuelvas la logística de tu viaje en minutos, ahorrándote horas de trabajo y asegurando que solo te preocupes por disfrutar.",
        icon: <Sparkles className="text-amber-400" size={48} />,
        color: "from-amber-500/20 to-orange-500/20",
        accent: "text-amber-400"
    },
    {
        title: "1. Configura el Viaje",
        description: "En la pestaña 'Configuración', pon el precio de la noche y cuántos días se quedan. El app hará la matemática base por ti.",
        icon: <Settings className="text-sky-400" size={48} />,
        color: "from-sky-500/20 to-blue-500/20",
        accent: "text-sky-400"
    },
    {
        title: "2. Añade a tu Gente",
        description: "Ve a la pestaña 'Gestión Grupo' y registra a todos. El app separa a los niños (≤5 años) para que no paguen hospedaje ni comida.",
        icon: <Users className="text-emerald-400" size={48} />,
        color: "from-emerald-500/20 to-teal-500/20",
        accent: "text-emerald-400"
    },
    {
        title: "3. Define la Alimentación",
        description: "En la pestaña 'Alimentación', planifica los menús por día (desayuno, almuerzo, cena) para saber qué ingredientes necesitarás.",
        icon: <UtensilsCrossed className="text-orange-400" size={48} />,
        color: "from-orange-500/20 to-red-500/20",
        accent: "text-orange-400"
    },
    {
        title: "4. El Súper y el Menú",
        description: "En 'Configuración -> Base de Precios' define los costos. Luego, en 'Supermercado', selecciona lo que vas a comprar. ¡Haz clic en los productos para marcarlos como comprados (se pondrán en gris)!",
        icon: <ShoppingCart className="text-purple-400" size={48} />,
        color: "from-purple-500/20 to-indigo-500/20",
        accent: "text-purple-400"
    },
    {
        title: "5. Revisa la Cuota",
        description: "¡Listo! En el Dashboard verás cuánto debe pagar cada persona. Sin peleas ni cálculos manuales al final del viaje.",
        icon: <PieChart className="text-rose-400" size={48} />,
        color: "from-rose-500/20 to-pink-500/20",
        accent: "text-rose-400"
    }
];

export const TutorialModal = ({ isOpen, onClose }: TutorialModalProps) => {
    const [currentStep, setCurrentStep] = useState(0);

    if (!isOpen) return null;

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onClose();
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
            <GlassCard className="max-w-xl w-full p-0 overflow-hidden shadow-[0_0_50px_rgba(14,165,233,0.15)] border-white/10 relative">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 hover:bg-white/10 rounded-full transition-colors"
                    title="Cerrar Guía"
                    aria-label="Cerrar Guía"
                >
                    <X size={20} className="text-slate-400" />
                </button>

                {/* Progress Bar */}
                <div className="flex h-1 bg-white/5">
                    {steps.map((_, idx) => (
                        <div
                            key={idx}
                            className={`flex-1 transition-all duration-500 ${idx <= currentStep ? 'bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]' : ''}`}
                        />
                    ))}
                </div>

                <div className="p-8 md:p-12 text-center space-y-8">
                    {/* Icon Container */}
                    <div className={`w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br ${steps[currentStep].color} flex items-center justify-center shadow-xl border border-white/10 relative group`}>
                        <div className="absolute inset-0 bg-white/10 rounded-3xl blur group-hover:blur-md transition-all" />
                        <div className="relative animate-bounce-slow">
                            {steps[currentStep].icon}
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="space-y-4">
                        <h2 className="text-3xl font-black text-white tracking-tight leading-tight uppercase">
                            {steps[currentStep].title}
                        </h2>
                        <p className="text-slate-400 text-base leading-relaxed font-medium">
                            {steps[currentStep].description}
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between pt-6">
                        <button
                            onClick={prevStep}
                            disabled={currentStep === 0}
                            className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-opacity ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'text-slate-500 hover:text-white'}`}
                            title="Paso Anterior"
                            aria-label="Paso Anterior"
                        >
                            <ChevronLeft size={16} /> Anterior
                        </button>

                        <Button
                            onClick={nextStep}
                            className={`min-w-[140px] ${currentStep === steps.length - 1 ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-sky-600 hover:bg-sky-500'}`}
                        >
                            {currentStep === steps.length - 1 ? (
                                <span className="flex items-center gap-2">¡Entendido! <CheckCircle2 size={18} /></span>
                            ) : (
                                <span className="flex items-center gap-2">Siguiente <ChevronRight size={18} /></span>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Step Indicators (Dots) */}
                <div className="bg-white/5 p-4 flex justify-center gap-2">
                    {steps.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentStep(idx)}
                            className={`h-1.5 rounded-full transition-all ${idx === currentStep ? 'w-8 bg-sky-500' : 'w-2 bg-slate-700 hover:bg-slate-600'}`}
                            title={`Ir al paso ${idx + 1}`}
                            aria-label={`Ir al paso ${idx + 1}`}
                        />
                    ))}
                </div>
            </GlassCard>
        </div>
    );
};
