/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  BookOpen, 
  User, 
  ChevronRight, 
  Brain, 
  Trophy,
  Sparkles,
  ArrowLeft,
  Loader2,
  Send,
  Check,
  X
} from 'lucide-react';
import { Lesson, View, Quiz } from './types';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeView, setActiveView] = useState<View>('home');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentQuizzes, setCurrentQuizzes] = useState<Quiz[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [completedLessons, setCompletedLessons] = useState<number[]>(() => {
    const saved = localStorage.getItem('completedLessons');
    return saved ? JSON.parse(saved) : [];
  });
  const [lessonQuizState, setLessonQuizState] = useState<{
    selectedOption: string | null;
    isCorrect: boolean | null;
    currentStep: number; // 0 for theory, 1 for practical
  }>({ selectedOption: null, isCorrect: null, currentStep: 0 });

  useEffect(() => {
    localStorage.setItem('completedLessons', JSON.stringify(completedLessons));
  }, [completedLessons]);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    
    fetch('/api/lessons')
      .then(res => res.json())
      .then(data => setLessons(data));

    fetch('/api/quizzes')
      .then(res => res.json())
      .then(data => setQuizzes(data));

    return () => clearTimeout(timer);
  }, []);

  const filteredLessons = selectedCategory === 'All' 
    ? lessons 
    : lessons.filter(l => l.category.includes(selectedCategory));

  const handleQuizAnswer = (option: string) => {
    if (selectedOption) return;
    setSelectedOption(option);
    const correct = option === currentQuizzes[currentQuizIndex].answer;
    setIsCorrect(correct);
    if (correct) setQuizScore(prev => prev + 1);

    setTimeout(() => {
      if (currentQuizIndex < currentQuizzes.length - 1) {
        setCurrentQuizIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        setShowQuizResult(true);
      }
    }, 1500);
  };

  const startQuiz = () => {
    // Shuffle and pick 10 random questions
    const shuffled = [...quizzes].sort(() => 0.5 - Math.random());
    setCurrentQuizzes(shuffled.slice(0, 10));
    setCurrentQuizIndex(0);
    setQuizScore(0);
    setShowQuizResult(false);
    setSelectedOption(null);
    setIsCorrect(null);
    setActiveView('quiz');
  };

  const resetQuiz = () => {
    startQuiz();
  };

  const markAsCompleted = (id: number) => {
    if (!completedLessons.includes(id)) {
      setCompletedLessons(prev => [...prev, id]);
    }
  };

  const progressPercentage = lessons.length > 0 
    ? Math.round((completedLessons.length / lessons.length) * 100) 
    : 0;

  const handleLessonQuizAnswer = (lessonId: number, option: string, correctAnswer: string, isLastStep: boolean) => {
    if (lessonQuizState.selectedOption) return;
    
    const correct = option === correctAnswer;
    setLessonQuizState(prev => ({ ...prev, selectedOption: option, isCorrect: correct }));
    
    if (correct) {
      setTimeout(() => {
        if (isLastStep) {
          markAsCompleted(lessonId);
        } else {
          setLessonQuizState({ selectedOption: null, isCorrect: null, currentStep: 1 });
        }
      }, 1000);
    }
  };

  const renderView = () => {
    if (selectedLesson) {
      return (
        <motion.div 
          key="lesson-detail"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="p-6 pb-24 space-y-6"
        >
            <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                setSelectedLesson(null);
                setLessonQuizState({ selectedOption: null, isCorrect: null, currentStep: 0 });
              }} 
              className="p-2 rounded-xl bg-white shadow-sm"
            >
              <ArrowLeft size={20} className="text-slate-900" />
            </button>
            <h1 className="text-xl font-bold truncate text-slate-900">{selectedLesson.title}</h1>
          </div>

          <div className="space-y-6">
            {selectedLesson.image_url && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl overflow-hidden shadow-md border-4 border-white"
              >
                <img 
                  src={selectedLesson.image_url} 
                  alt={selectedLesson.title} 
                  className="w-full h-48 object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            )}

            <div className="glass-card p-6 rounded-3xl bg-white border-2 border-indigo-500 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-indigo-600">
                <Sparkles size={18} />
                <span className="text-xs font-bold uppercase tracking-wider">Tóm tắt Gen Z</span>
              </div>
              <p className="text-lg font-extrabold leading-relaxed text-slate-900 italic">
                "{selectedLesson.genz_summary}"
              </p>
            </div>

            <div className="space-y-4">
              <section className="space-y-2">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-tight">Nội dung chi tiết</h3>
                <div className="glass-card p-6 rounded-3xl bg-white shadow-sm border-slate-100">
                  <p className="text-slate-900 text-lg font-medium leading-relaxed whitespace-pre-line">{selectedLesson.content}</p>
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-tight">Ghi chú pháp lý</h3>
                <div className="glass-card p-6 rounded-3xl bg-emerald-50 border-none">
                  <p className="text-slate-800 text-base leading-relaxed">{selectedLesson.summary}</p>
                </div>
              </section>

              <section className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                    <Brain size={18} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Kiểm tra nhanh</h3>
                </div>

                {(() => {
                  const lessonQuizzes = quizzes.filter(q => q.lesson_id === selectedLesson.id);
                  const theoryQuiz = lessonQuizzes.find(q => q.type === 'theory');
                  const practicalQuiz = lessonQuizzes.find(q => q.type === 'practical');
                  
                  const isCompleted = completedLessons.includes(selectedLesson.id);

                  if (isCompleted) {
                    return (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card p-6 rounded-3xl bg-emerald-500 text-white flex flex-col items-center gap-3 text-center"
                      >
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                          <Check size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-lg">Tuyệt vời! 🎉</p>
                          <p className="text-white/80 text-sm">Bạn đã hoàn thành bài học này.</p>
                        </div>
                        <button 
                          onClick={() => {
                            setSelectedLesson(null);
                            setLessonQuizState({ selectedOption: null, isCorrect: null, currentStep: 0 });
                          }}
                          className="mt-2 px-6 py-2 bg-white text-emerald-600 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all"
                        >
                          Tiếp tục học
                        </button>
                      </motion.div>
                    );
                  }

                  if (!theoryQuiz && !practicalQuiz) {
                    return (
                      <button
                        onClick={() => {
                          markAsCompleted(selectedLesson.id);
                        }}
                        className="w-full py-4 bg-electric-blue text-white rounded-2xl font-bold shadow-lg shadow-electric-blue/20 active:scale-95 transition-all"
                      >
                        Đã hiểu bài này! 🚀
                      </button>
                    );
                  }

                  // Determine which quiz to show
                  let currentQuiz = theoryQuiz;
                  let isLastStep = !practicalQuiz;

                  if (lessonQuizState.currentStep === 1 && practicalQuiz) {
                    currentQuiz = practicalQuiz;
                    isLastStep = true;
                  } else if (!theoryQuiz && practicalQuiz) {
                    currentQuiz = practicalQuiz;
                    isLastStep = true;
                  }

                  if (!currentQuiz) return null;

                  const totalSteps = (theoryQuiz && practicalQuiz) ? 2 : 1;
                  const displayStep = (theoryQuiz && practicalQuiz && lessonQuizState.currentStep === 1) ? 2 : 1;

                  return (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">
                          Câu hỏi {displayStep}/{totalSteps}: {currentQuiz.type === 'theory' ? 'Lý thuyết' : 'Thực tế'}
                        </span>
                        <div className="flex gap-1">
                          <div className={`w-8 h-1 rounded-full ${displayStep >= 1 ? 'bg-orange-500' : 'bg-slate-200'}`} />
                          {totalSteps > 1 && (
                            <div className={`w-8 h-1 rounded-full ${displayStep >= 2 ? 'bg-orange-500' : 'bg-slate-200'}`} />
                          )}
                        </div>
                      </div>
                      
                      <p className="text-slate-700 font-bold leading-tight">{currentQuiz.question}</p>
                      <div className="space-y-2">
                        {currentQuiz.options.map((option, idx) => {
                          const isSelected = lessonQuizState.selectedOption === option;
                          let btnClass = "bg-white border-slate-100 text-slate-700 hover:border-orange-200";
                          
                          if (isSelected) {
                            btnClass = lessonQuizState.isCorrect 
                              ? "bg-emerald-500 border-emerald-600 text-white" 
                              : "bg-red-500 border-red-600 text-white";
                          }

                          return (
                            <button
                              key={idx}
                              disabled={!!lessonQuizState.selectedOption}
                              onClick={() => handleLessonQuizAnswer(selectedLesson.id, option, currentQuiz!.answer, isLastStep)}
                              className={`w-full p-4 rounded-2xl border-2 text-left text-sm font-bold transition-all flex items-center justify-between ${btnClass}`}
                            >
                              <span>{option}</span>
                              {isSelected && (
                                lessonQuizState.isCorrect ? <Check size={16} /> : <X size={16} />
                              )}
                            </button>
                          );
                        })}
                      </div>
                      {lessonQuizState.selectedOption && !lessonQuizState.isCorrect && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-xs font-bold text-center"
                        >
                          Sai rồi! Thử lại nhé bạn ơi. 💪
                        </motion.p>
                      )}
                      {lessonQuizState.selectedOption && !lessonQuizState.isCorrect && (
                        <button 
                          onClick={() => setLessonQuizState(prev => ({ ...prev, selectedOption: null, isCorrect: null }))}
                          className="w-full py-2 text-orange-600 font-bold text-sm"
                        >
                          Thử lại
                        </button>
                      )}
                    </div>
                  );
                })()}
              </section>
            </div>
          </div>
        </motion.div>
      );
    }

    switch (activeView) {
      case 'quiz':
        if (currentQuizzes.length === 0) return <div key="quiz-loading" className="p-10 text-center">Đang tải câu hỏi...</div>;
        
        if (showQuizResult) {
          return (
            <motion.div 
              key="quiz-result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 20 }}
              className="p-6 pb-24 flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6"
            >
              <div className="w-24 h-24 bg-mint-green/20 rounded-full flex items-center justify-center text-mint-green">
                <Trophy size={48} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Hoàn thành thử thách!</h2>
                <p className="text-slate-500 mt-2">Bạn đã trả lời đúng {quizScore}/{currentQuizzes.length} câu hỏi.</p>
              </div>
              <div className="w-full space-y-3">
                <button 
                  onClick={resetQuiz}
                  className="w-full py-4 bg-electric-blue text-white rounded-2xl font-bold"
                >
                  Làm bộ câu hỏi mới
                </button>
                <button 
                  onClick={() => setActiveView('home')}
                  className="w-full py-4 bg-white text-slate-600 rounded-2xl font-bold border border-slate-200"
                >
                  Về trang chủ
                </button>
              </div>
            </motion.div>
          );
        }

        const currentQuiz = currentQuizzes[currentQuizIndex];
        return (
          <motion.div 
            key={`quiz-question-${currentQuizIndex}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="p-6 pb-24 space-y-8"
          >
            <div className="flex items-center justify-between">
              <button onClick={() => setActiveView('home')} className="p-2 rounded-xl bg-white shadow-sm">
                <ArrowLeft size={20} className="text-slate-900" />
              </button>
              <div className="text-sm font-bold text-slate-400">
                Câu {currentQuizIndex + 1}/{currentQuizzes.length}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold leading-tight text-slate-900">
                {currentQuiz.question}
              </h2>
              <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuizIndex + 1) / currentQuizzes.length) * 100}%` }}
                  className="h-full bg-electric-blue"
                />
              </div>
            </div>

            <div className="space-y-3">
              {currentQuiz.options.map((option, idx) => {
                const isSelected = selectedOption === option;
                let bgColor = 'bg-white';
                let borderColor = 'border-slate-100';
                let textColor = 'text-slate-700';

                if (isSelected) {
                  if (isCorrect) {
                    bgColor = 'bg-emerald-500';
                    borderColor = 'border-emerald-600';
                    textColor = 'text-white';
                  } else {
                    bgColor = 'bg-red-500';
                    borderColor = 'border-red-600';
                    textColor = 'text-white';
                  }
                } else if (selectedOption && option === currentQuiz.answer) {
                  // Show correct answer if user was wrong
                  bgColor = 'bg-emerald-50';
                  borderColor = 'border-emerald-500';
                  textColor = 'text-emerald-700';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleQuizAnswer(option)}
                    disabled={!!selectedOption}
                    className={`w-full p-5 rounded-3xl border-2 text-left font-bold transition-all flex items-center justify-between ${bgColor} ${borderColor} ${textColor} ${!selectedOption && 'hover:border-electric-blue/30 hover:bg-emerald-50'}`}
                  >
                    <span>{option}</span>
                    {isSelected && (
                      isCorrect ? <Check size={20} className="text-white" /> : <X size={20} className="text-white" />
                    )}
                    {!isSelected && selectedOption && option === currentQuiz.answer && (
                      <Check size={20} className="text-emerald-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        );

      case 'home':
        return (
          <motion.div 
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="p-6 pb-24 space-y-8"
          >
            <header className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Chào Chiến Thần! 🚀</h1>
                <p className="text-slate-500">Hôm nay "chốt" luật nào?</p>
              </div>
              <button 
                onClick={() => setActiveView('profile')}
                className="w-12 h-12 rounded-full bg-electric-blue/10 flex items-center justify-center border-2 border-electric-blue/20"
              >
                <User className="text-electric-blue" size={24} />
              </button>
            </header>

            <section className="glass-card p-6 rounded-3xl bg-slate-900 text-white overflow-hidden relative shadow-lg">
              <div className="relative z-10">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Tiến độ học tập</h3>
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-4xl font-black text-mint-green">{progressPercentage}%</span>
                  <span className="mb-1 text-slate-400 font-medium">Hoàn thành</span>
                </div>
                <div className="mt-4 h-3 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    className="h-full bg-electric-blue shadow-[0_0_10px_rgba(45,125,255,0.5)]"
                  />
                </div>
              </div>
              <Sparkles className="absolute -right-4 -bottom-4 text-white/5 w-32 h-32 rotate-12" />
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Quick Access</h2>
                <button className="text-sm text-electric-blue font-medium">Xem tất cả</button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={() => setActiveView('learning')}
                  className="glass-card p-4 rounded-3xl flex items-center gap-4 hover:bg-emerald-50 transition-colors text-left"
                >
                  <div className="p-3 rounded-2xl bg-mint-green/10 text-emerald-600">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <span className="block font-bold">Phá đảo TT 26</span>
                    <span className="text-xs text-slate-500">Học nhanh, nhớ lâu</span>
                  </div>
                  <ChevronRight className="ml-auto text-slate-300" />
                </button>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Thử thách mới</h2>
              <button 
                onClick={startQuiz}
                className="w-full glass-card p-4 rounded-3xl flex items-center gap-4 hover:bg-emerald-50 transition-colors"
              >
                <div className="p-3 rounded-2xl bg-orange-100 text-orange-600">
                  <Brain size={24} />
                </div>
                <div className="flex-1 text-left">
                  <span className="block font-bold">Bài kiểm tra</span>
                  <span className="text-xs text-slate-500">Thử thách kiến thức địa chính</span>
                </div>
                <ChevronRight className="text-slate-300" />
              </button>
            </section>
          </motion.div>
        );

      case 'learning':
        return (
          <motion.div 
            key="learning"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="p-6 pb-24 space-y-6"
          >
            <div className="flex items-center gap-4">
              <button onClick={() => setActiveView('home')} className="p-2 rounded-xl bg-white shadow-sm">
                <ArrowLeft size={20} className="text-slate-900" />
              </button>
              <h1 className="text-xl font-bold text-slate-900">Thư viện bài học</h1>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {['All', 'Luật', 'Thông tư', 'Deep Dive'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                    selectedCategory === cat 
                    ? 'bg-electric-blue text-white' 
                    : 'bg-white text-slate-500 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {filteredLessons.map(lesson => (
                <button 
                  key={lesson.id}
                  onClick={() => {
                    setSelectedLesson(lesson);
                    setLessonQuizState({ selectedOption: null, isCorrect: null, currentStep: 0 });
                  }}
                  className="w-full glass-card p-5 rounded-3xl text-left space-y-3 group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full bg-electric-blue/10 text-electric-blue text-[10px] font-bold uppercase">
                        {lesson.category}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">
                        {lesson.chapter}
                      </span>
                      {completedLessons.includes(lesson.id) && (
                        <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase flex items-center gap-1">
                          <Check size={10} />
                          Xong
                        </span>
                      )}
                    </div>
                    <ChevronRight className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{lesson.title}</h3>
                  <p className="text-sm line-clamp-2 text-slate-600">{lesson.genz_summary}</p>
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 'profile':
        return (
          <motion.div 
            key="profile"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-6 pb-24 space-y-8"
          >
            <div className="flex items-center gap-4">
              <button onClick={() => setActiveView('home')} className="p-2 rounded-xl bg-white shadow-sm">
                <ArrowLeft size={20} className="text-slate-900" />
              </button>
              <h1 className="text-xl font-bold text-slate-900">Hồ sơ cá nhân</h1>
            </div>

            <div className="flex flex-col items-center py-6 space-y-4">
              <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-white shadow-lg">
                <User size={48} className="text-indigo-600" />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-black text-slate-900">Chiến Thần Địa Chính</h2>
                <p className="text-slate-500 text-sm font-medium">Đang trên đường phá đảo Luật Đất đai</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-4 rounded-3xl bg-white border-slate-100 shadow-sm text-center">
                <span className="block text-2xl font-black text-electric-blue">{completedLessons.length}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Bài học xong</span>
              </div>
              <div className="glass-card p-4 rounded-3xl bg-white border-slate-100 shadow-sm text-center">
                <span className="block text-2xl font-black text-orange-500">{lessons.length - completedLessons.length}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Bài còn lại</span>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight px-2">Cài đặt</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => {
                    if (confirm('Bạn có chắc muốn xóa hết tiến độ học tập?')) {
                      setCompletedLessons([]);
                      localStorage.removeItem('completedLessons');
                      setActiveView('home');
                    }
                  }}
                  className="w-full p-4 rounded-2xl bg-red-50 text-red-600 flex items-center justify-between group active:scale-95 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-100 group-hover:bg-red-200 transition-colors">
                      <X size={18} />
                    </div>
                    <span className="font-bold text-sm">Xóa toàn bộ tiến độ</span>
                  </div>
                  <ChevronRight size={16} className="text-red-300" />
                </button>
              </div>
            </div>

            <div className="pt-8 text-center">
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Học Địa Chính v1.0</p>
            </div>
          </motion.div>
        );

      default:
        return <div className="p-10 text-center">Đang phát triển... 🛠</div>;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-emerald-50 relative overflow-hidden">

      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] bg-electric-blue flex flex-col items-center justify-center text-white"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 12 }}
              className="relative"
            >
              <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl rotate-12">
                <BookOpen className="text-electric-blue w-12 h-12 -rotate-12" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-4 border-2 border-dashed border-white/30 rounded-full"
              />
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 text-center"
            >
              <h1 className="text-3xl font-black tracking-tighter">HỌC ĐỊA CHÍNH</h1>
              <p className="text-white/70 font-medium tracking-widest text-xs mt-2 uppercase">Gen Z Law Edition</p>
            </motion.div>
            <motion.div 
              className="absolute bottom-12 flex items-center gap-2 text-white/50 text-xs font-bold uppercase tracking-widest"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Loader2 className="animate-spin w-4 h-4" />
              Đang tải dữ liệu...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <AnimatePresence mode="wait">
          {renderView()}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-6 right-6 glass-card rounded-3xl p-3 flex items-center justify-around z-50 shadow-xl border-white/40">
        <NavButton 
          active={activeView === 'home'} 
          onClick={() => {
            setActiveView('home');
            setSelectedLesson(null);
            setLessonQuizState({ selectedOption: null, isCorrect: null, currentStep: 0 });
          }} 
          icon={<Home size={22} />} 
          label="Home" 
        />
        <NavButton 
          active={activeView === 'learning'} 
          onClick={() => {
            setActiveView('learning');
            setSelectedLesson(null);
            setLessonQuizState({ selectedOption: null, isCorrect: null, currentStep: 0 });
          }} 
          icon={<BookOpen size={22} />} 
          label="Học" 
        />
        <NavButton 
          active={activeView === 'profile'} 
          onClick={() => {
            setActiveView('profile');
            setSelectedLesson(null);
            setLessonQuizState({ selectedOption: null, isCorrect: null, currentStep: 0 });
          }} 
          icon={<User size={22} />} 
          label="Tôi" 
        />
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all duration-300 ${active ? 'text-electric-blue scale-110' : 'text-slate-400'}`}
    >
      <div className={`p-2 rounded-2xl ${active ? 'bg-electric-blue/10' : ''}`}>
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
    </button>
  );
}
