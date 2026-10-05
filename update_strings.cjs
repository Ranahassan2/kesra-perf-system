const fs = require('fs');
const file = '/home/beta-technology/Music/perf-system-final/src/components/EvaluationFormModal.tsx';
let code = fs.readFileSync(file, 'utf8');

// Replace {language === 'ar' ? 'AR' : 'EN'} with 'EN'
code = code.replace(/\{language === 'ar' \? 'مراجعة الموظف والتأكيد الرسمي' : '([^']+)'\}/g, "'$1'");
code = code.replace(/\{language === 'ar' \? 'يرجى مراجعة كشف الدرجات الفصلي أعلاه. الضغط على تأكيد يسجّل موافقتك موثقة بالتاريخ والوقت.' : '([^']+)'\}/g, "'$1'");
code = code.replace(/\{language === 'ar' \? 'ملاحظات أو تعليقات اختيارية عند التأكيد\.\.\.' : '([^']+)'\}/g, "'$1'");
code = code.replace(/\{language === 'ar' \? 'تم التأكيد بواسطة' : '([^']+)'\}/g, "'$1'");
code = code.replace(/\{language === 'ar' \? 'بتاريخ' : '([^']+)'\}/g, "'$1'");
code = code.replace(/\{language === 'ar' \? 'المقيّم' : '([^']+)'\}/g, "'$1'");
code = code.replace(/\(language === 'ar' \? 'غير متوفر' : '([^']+)'\)/g, "'$1'");
code = code.replace(/\$\{language === 'ar' \? 'text-right' : 'text-left'\}/g, 'text-left');
code = code.replace(/\{language === 'ar' \? 'نموذج للقراءة فقط' : '([^']+)'\}/g, "'$1'");
code = code.replace(/\{language === 'ar' \? 'هذا التقييم تم إغلاقه ولا يمكن تعديله. يتم عرض البيانات للمراجعة والتدقيق فقط.' : '([^']+)'\}/g, "'$1'");
code = code.replace(/\(language === 'ar' \? 'كشف الدرجات مقفل بشكل نهائي ومؤرشف في سجل التدقيق.' : '([^']+)'\)/g, "'$1'");
code = code.replace(/\(language === 'ar' \? 'تأكد من تقييم جميع المؤشرات من 1 إلى 10 قبل الإرسال.' : '([^']+)'\)/g, "'$1'");
code = code.replace(/\(language === 'ar' \? 'الإجراء معطل: لم يستوفِ الموظف حد مدة الخدمة \(شهرين\).' : '([^']+)'\)/g, "'$1'");
code = code.replace(/\{language === 'ar' \? 'إغلاق' : '([^']+)'\}/g, "'$1'");
code = code.replace(/\{language === 'ar' \? 'تحليل الخبير \(AI\)' : '([^']+)'\}/g, "'$1'");
code = code.replace(/\(language === 'ar' \? 'حفظ كمسودة' : '([^']+)'\)/g, "'$1'");
code = code.replace(/\(language === 'ar' \? 'رفع التقييم للمراجعة' : '([^']+)'\)/g, "'$1'");
code = code.replace(/\{language === 'ar' \? 'اعتماد المدير الفني' : '([^']+)'\}/g, "'$1'");
code = code.replace(/\(language === 'ar' \? 'الاعتماد النهائي \(HR\/CEO\)' : '([^']+)'\)/g, "'$1'");
code = code.replace(/\(language === 'ar' \? 'نشر للموظف' : '([^']+)'\)/g, "'$1'");
code = code.replace(/\(language === 'ar' \? 'تأكيد استلام التقييم' : '([^']+)'\)/g, "'$1'");
code = code.replace(/\{language === 'ar' \? 'مغلق \(للقراءة فقط\)' : '([^']+)'\}/g, "'$1'");
code = code.replace(/\{language === 'ar' \? 'وضع التعديل' : '([^']+)'\}/g, "'$1'");
code = code.replace(/\{language === 'ar' \? 'عرض دليل التقييم من 1 إلى 10' : '([^']+)'\}/g, "'$1'");
code = code.replace(/\{language === 'ar' \? `معيار التقييم لـ \$\{kpi\.name\}:` : `Evaluation criteria for \$\{kpi\.name\}:`\}/g, "{`Evaluation criteria for ${kpi.name}:`}");
code = code.replace(/\{language === 'ar' \? 'ممتاز:' : '([^']+)'\}/g, "'$1'");
code = code.replace(/\{language === 'ar' \? 'جيد:' : '([^']+)'\}/g, "'$1'");
code = code.replace(/\{language === 'ar' \? 'يحتاج تحسين:' : '([^']+)'\}/g, "'$1'");
code = code.replace(/\{language === 'ar' \? 'ضعيف \/ حرج:' : '([^']+)'\}/g, "'$1'");

fs.writeFileSync(file, code);
console.log('done');
