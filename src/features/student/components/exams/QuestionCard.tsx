import React from "react";
import clsx from "clsx";
import { type ExamTakingQuestion } from "../../types";

interface QuestionCardProps {
    question: ExamTakingQuestion;
    index: number;
    selectedOptionId: number | null;
    onSelectOption: (questionId: number, optionId: number) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
    question,
    index,
    selectedOptionId,
    onSelectOption,
}) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-8">
            <div className="flex gap-4 mb-6">
                <span className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-100">
                    {index}
                </span>
                <h3 className="text-lg font-medium text-gray-900 leading-relaxed pt-1">
                    {question.content}
                </h3>
            </div>

            <div className="space-y-3 pl-0 sm:pl-13">
                {question.options.map((option, optIdx) => {
                    const isSelected = selectedOptionId === option.optionId;
                    const optionLabel = String.fromCharCode(65 + optIdx); 

                    return (
                        <button
                            key={option.optionId}
                            onClick={() => onSelectOption(question.questionId, option.optionId)}
                            className={clsx(
                                "w-full text-left flex items-start gap-3.5 p-4 rounded-xl border transition-all duration-200 focus:outline-none",
                                isSelected
                                    ? "border-blue-500 bg-blue-50/40 ring-1 ring-blue-500 shadow-sm"
                                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            )}
                        >
                            <div
                                className={clsx(
                                    "shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors mt-0.5",
                                    isSelected ? "border-blue-600" : "border-gray-300"
                                )}
                            >
                                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-in zoom-in duration-200" />}
                            </div>
                            
                            <div className="flex-1 leading-relaxed text-[15px]">
                                <span className={clsx("font-bold mr-2", isSelected ? "text-blue-700" : "text-gray-700")}>
                                    {optionLabel}.
                                </span>
                                <span className={clsx(isSelected ? "font-medium text-gray-900" : "text-gray-600")}>
                                    {option.content}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};