-- ============================================================
-- SEED: 15 ricette virali di esempio per TheViralRecipe
-- Esegui nel SQL Editor di Supabase
-- ============================================================

INSERT INTO recipes (
  title_it, title_en,
  slug_it, slug_en,
  description_it, description_en,
  category, difficulty,
  time_prep_minutes, time_cook_minutes, time_total_minutes,
  servings,
  ingredients_it, ingredients_en,
  instructions_it, instructions_en,
  image_url,
  source_platform, source_url, source_author,
  votes_count, views_count, saves_count, made_count,
  viral_score, is_published, is_featured,
  tags_cache
) VALUES

-- 1. Pasta al pomodoro TikTok virale
(
  'Pasta al Pomodoro Virale di TikTok',
  'TikTok Viral Tomato Pasta',
  'pasta-pomodoro-virale-tiktok',
  'tiktok-viral-tomato-pasta',
  'La pasta al pomodoro più vista di TikTok con oltre 50 milioni di visualizzazioni. Tecnica segreta: il pomodoro si cuoce direttamente nell''acqua della pasta.',
  'The most watched tomato pasta on TikTok with over 50 million views. Secret technique: the tomato cooks directly in the pasta water.',
  'primi', 'facile',
  5, 15, 20, 4,
  '["400g spaghetti", "500g pomodorini ciliegino", "4 spicchi aglio", "peperoncino q.b.", "olio EVO", "basilico fresco", "sale"]',
  '["400g spaghetti", "500g cherry tomatoes", "4 garlic cloves", "chili pepper to taste", "extra virgin olive oil", "fresh basil", "salt"]',
  '["Metti i pomodorini interi nell''''acqua della pasta bollente", "Cuoci gli spaghetti al dente", "Schiaccia i pomodori con una forchetta", "Condisci con aglio, olio e peperoncino", "Aggiungi basilico e servi"]',
  '["Put whole cherry tomatoes in the boiling pasta water", "Cook spaghetti al dente", "Crush tomatoes with a fork", "Season with garlic, oil and chili", "Add basil and serve"]',
  'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80',
  'tiktok', 'https://tiktok.com/@example/pasta', 'cucina_italiana',
  48200, 2100000, 12400, 3800,
  890.5, true, true,
  ARRAY['pasta', 'pomodoro', 'virale', 'tiktok', 'facile']
),

-- 2. Feta baked pasta (il più virale di sempre)
(
  'Pasta al Feta al Forno (il Trend che ha Conquistato il Mondo)',
  'Baked Feta Pasta (The Trend That Conquered the World)',
  'pasta-feta-forno-virale',
  'baked-feta-pasta-viral',
  'La ricetta finlandese diventata virale in tutto il mondo. Un blocco di feta, pomodorini e pasta: il risultato è magico.',
  'The Finnish recipe that went viral worldwide. A block of feta, cherry tomatoes and pasta: the result is magical.',
  'primi', 'facile',
  5, 35, 40, 4,
  '["400g pasta (penne o rigatoni)", "200g feta intera", "500g pomodorini ciliegino", "4 spicchi aglio", "olio EVO", "peperoncino", "basilico"]',
  '["400g pasta (penne or rigatoni)", "200g whole feta block", "500g cherry tomatoes", "4 garlic cloves", "extra virgin olive oil", "chili pepper", "basil"]',
  '["Preriscalda il forno a 200°C", "Metti i pomodorini in una teglia, aggiungi il blocco di feta al centro", "Condisci con olio, aglio e peperoncino", "Inforna 30 minuti finché la feta è dorata", "Cuoci la pasta, scolala e mescolala al feta fuso"]',
  '["Preheat oven to 200°C (400°F)", "Place cherry tomatoes in a baking dish, add the feta block in the center", "Season with oil, garlic and chili", "Bake 30 minutes until feta is golden", "Cook pasta, drain and mix with melted feta"]',
  'https://images.unsplash.com/photo-1673439782099-67c806f7d7d2?w=800&q=80',
  'tiktok', 'https://tiktok.com/@example/feta', 'foodtok_official',
  125000, 8500000, 45000, 18000,
  2450.8, true, true,
  ARRAY['pasta', 'feta', 'forno', 'virale', 'facile', 'trend']
),

-- 3. Pancake giapponesi fluffy
(
  'Pancake Giapponesi Fluffy (Soufflé Pancake)',
  'Japanese Fluffy Soufflé Pancakes',
  'pancake-giapponesi-fluffy-souffle',
  'japanese-fluffy-souffle-pancakes',
  'I pancake alti 10 cm che fanno impazzire Instagram. Segreto: gli albumi montati a neve e la cottura lentissima.',
  'The 10cm tall pancakes driving Instagram crazy. Secret: beaten egg whites and very slow cooking.',
  'colazione', 'medio',
  15, 20, 35, 2,
  '["2 uova (tuorli e albumi separati)", "2 cucchiai latte", "1 cucchiaino estratto vaniglia", "50g farina 00", "1 cucchiaino lievito", "2 cucchiai zucchero", "burro per cuocere"]',
  '["2 eggs (yolks and whites separated)", "2 tablespoons milk", "1 teaspoon vanilla extract", "50g all-purpose flour", "1 teaspoon baking powder", "2 tablespoons sugar", "butter for cooking"]',
  '["Sbatti i tuorli con latte e vaniglia", "Aggiungi farina e lievito", "Monta gli albumi con lo zucchero a neve ferma", "Incorpora delicatamente gli albumi al composto", "Cuoci in padella con coperchio a fuoco basso 4 minuti per lato"]',
  '["Beat egg yolks with milk and vanilla", "Add flour and baking powder", "Beat egg whites with sugar until stiff peaks form", "Gently fold whites into batter", "Cook in pan with lid on low heat 4 minutes each side"]',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
  'instagram', 'https://instagram.com/p/example', 'tokyo_foodie',
  67500, 3200000, 28000, 9200,
  1340.2, true, false,
  ARRAY['pancake', 'giapponesi', 'colazione', 'fluffy', 'instagram']
),

-- 4. Pasta cacio e pepe cremosa
(
  'Cacio e Pepe Cremosa (La Versione Definitiva)',
  'Creamy Cacio e Pepe (The Definitive Version)',
  'cacio-e-pepe-cremosa-definitiva',
  'creamy-cacio-e-pepe-definitive',
  'La versione scientificamente perfetta della cacio e pepe: niente grumi, cremosità garantita. Il segreto è nell''amido.',
  'The scientifically perfect version of cacio e pepe: no lumps, guaranteed creaminess. The secret is in the starch.',
  'primi', 'medio',
  5, 15, 20, 2,
  '["200g tonnarelli o spaghetti", "100g pecorino romano DOP grattugiato", "50g parmigiano reggiano grattugiato", "pepe nero macinato fresco abbondante", "sale"]',
  '["200g tonnarelli or spaghetti", "100g grated Pecorino Romano DOP", "50g grated Parmigiano Reggiano", "plenty of freshly ground black pepper", "salt"]',
  '["Tosta il pepe in padella a secco", "Cuoci la pasta in poca acqua salata", "Mescola i formaggi con acqua fredda per creare una crema", "Togli la pasta dall''''acqua, uniscila al pepe tostato", "Aggiungi la crema di formaggio fuori dal fuoco mescolando"]',
  '["Toast pepper in dry pan", "Cook pasta in little salted water", "Mix cheeses with cold water to create a cream", "Remove pasta from water, combine with toasted pepper", "Add cheese cream off heat while stirring"]',
  'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&q=80',
  'youtube', 'https://youtube.com/watch?v=example', 'chef_romano',
  89000, 4100000, 34000, 15600,
  1780.4, true, true,
  ARRAY['cacio e pepe', 'romana', 'pasta', 'cremosa', 'youtube']
),

-- 5. Butter board virale
(
  'Butter Board: il Trend più Strano (e Buono) dell''Anno',
  'Butter Board: The Weirdest (and Best) Food Trend of the Year',
  'butter-board-trend-virale',
  'butter-board-viral-food-trend',
  'Burro spalmato su un tagliere con erbe, spezie e guarnizioni. Sembra strano ma è letteralmente il modo migliore di mangiare il pane.',
  'Butter spread on a board with herbs, spices and garnishes. It looks weird but it''s literally the best way to eat bread.',
  'antipasti', 'facile',
  10, 0, 10, 6,
  '["250g burro morbido a temperatura ambiente", "aglio in polvere", "scorza di limone", "peperoncino in fiocchi", "miele", "erbe fresche (rosmarino, timo)", "sale marino in fiocchi", "pane a fette per servire"]',
  '["250g softened butter at room temperature", "garlic powder", "lemon zest", "chili flakes", "honey", "fresh herbs (rosemary, thyme)", "flaky sea salt", "sliced bread to serve"]',
  '["Lascia il burro a temperatura ambiente per 1 ora", "Spalma il burro su un tagliere di legno", "Aggiungi aglio in polvere, scorza di limone, peperoncino", "Irrora con miele", "Aggiungi erbe fresche e sale marino", "Servi con pane fresco a fette"]',
  '["Leave butter at room temperature for 1 hour", "Spread butter on a wooden board", "Add garlic powder, lemon zest, chili flakes", "Drizzle with honey", "Add fresh herbs and sea salt", "Serve with fresh sliced bread"]',
  'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800&q=80',
  'tiktok', 'https://tiktok.com/@example/butterboard', 'foodtiktok_queen',
  43000, 1900000, 18700, 6800,
  820.6, true, false,
  ARRAY['butter board', 'antipasto', 'trend', 'tiktok', 'facile']
),

-- 6. Birria tacos
(
  'Birria Tacos: i Tacos Messicani che Fanno Impazzire TikTok',
  'Birria Tacos: The Mexican Tacos Driving TikTok Crazy',
  'birria-tacos-messicani-virali',
  'birria-tacos-viral-mexican',
  'I tacos fritti nel consommé di carne con formaggio filante che cola. La ricetta messicana più virale degli ultimi anni.',
  'Tacos fried in meat consommé with stretchy melting cheese. The most viral Mexican recipe in recent years.',
  'secondi', 'difficile',
  30, 180, 210, 6,
  '["1kg manzo (chuck roast)", "4 chili guajillo secchi", "2 chili ancho secchi", "cipolla", "aglio", "pomodori", "spezie (cumino, origano, cannella)", "tortillas di mais", "formaggio Oaxaca o mozzarella", "coriandolo"]',
  '["1kg beef (chuck roast)", "4 dried guajillo chilies", "2 dried ancho chilies", "onion", "garlic", "tomatoes", "spices (cumin, oregano, cinnamon)", "corn tortillas", "Oaxaca cheese or mozzarella", "cilantro"]',
  '["Fai tostare i chili in padella senza olio", "Ammollali in acqua calda 20 minuti", "Frulla i chili con aglio, pomodori e spezie", "Cuoci il manzo nel consommé per 3 ore a fuoco basso", "Sfilaccia la carne, immergi le tortillas nel consommé", "Friggi le tortillas con carne e formaggio"]',
  '["Toast chilies in dry pan", "Soak in hot water 20 minutes", "Blend chilies with garlic, tomatoes and spices", "Cook beef in consommé for 3 hours on low heat", "Shred meat, dip tortillas in consommé", "Fry tortillas with meat and cheese"]',
  'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80',
  'tiktok', 'https://tiktok.com/@example/birria', 'mexican_food_lover',
  56000, 2800000, 22000, 7400,
  1120.3, true, false,
  ARRAY['tacos', 'messicano', 'birria', 'virale', 'tiktok', 'carne']
),

-- 7. Dalgona coffee
(
  'Dalgona Coffee: il Caffè Montato che ha Conquistato il Mondo',
  'Dalgona Coffee: The Whipped Coffee That Conquered the World',
  'dalgona-coffee-caffe-montato-virale',
  'dalgona-coffee-whipped-viral',
  'Il caffè coreano montato a neve diventato virale durante il lockdown. Facile, scenografico e buonissimo.',
  'The Korean whipped coffee that went viral during lockdown. Easy, photogenic and delicious.',
  'bevande', 'facile',
  5, 0, 5, 1,
  '["2 cucchiai caffè solubile", "2 cucchiai zucchero", "2 cucchiai acqua calda", "200ml latte freddo", "ghiaccio"]',
  '["2 tablespoons instant coffee", "2 tablespoons sugar", "2 tablespoons hot water", "200ml cold milk", "ice"]',
  '["Metti caffè, zucchero e acqua calda in una ciotola", "Monta con le fruste per 3-4 minuti fino a ottenere una crema soda", "Versa il latte freddo con ghiaccio nel bicchiere", "Aggiungi la crema di caffè sopra", "Mescola prima di bere"]',
  '["Put instant coffee, sugar and hot water in a bowl", "Whip with beaters for 3-4 minutes until firm cream", "Pour cold milk with ice into glass", "Add coffee cream on top", "Stir before drinking"]',
  'https://images.unsplash.com/photo-1592663527359-cf6642f54cff?w=800&q=80',
  'instagram', 'https://instagram.com/p/dalgona', 'coffee_aesthetic',
  92000, 5600000, 41000, 28000,
  2180.7, true, false,
  ARRAY['dalgona', 'caffè', 'bevanda', 'coreano', 'virale', 'facile']
),

-- 8. Cloud bread
(
  'Cloud Bread: il Pane Senza Farina di TikTok',
  'Cloud Bread: TikTok''s Flour-Free Bread',
  'cloud-bread-senza-farina-tiktok',
  'cloud-bread-flour-free-tiktok',
  'Solo 3 ingredienti: albumi, zucchero e cremor tartaro. Il pane rosa soffice come una nuvola che ha fatto impazzire TikTok.',
  'Just 3 ingredients: egg whites, sugar and cream of tartar. The pink bread soft as a cloud that drove TikTok crazy.',
  'snack', 'facile',
  10, 25, 35, 4,
  '["3 albumi a temperatura ambiente", "3 cucchiai zucchero", "1/4 cucchiaino cremor tartaro", "colorante alimentare rosa (opzionale)"]',
  '["3 egg whites at room temperature", "3 tablespoons sugar", "1/4 teaspoon cream of tartar", "pink food coloring (optional)"]',
  '["Preriscalda il forno a 150°C", "Monta gli albumi con cremor tartaro a neve ferma", "Aggiungi lo zucchero gradualmente continuando a montare", "Aggiungi il colorante se vuoi il rosa TikTok", "Metti su carta forno con una spatola formando un ovale", "Cuoci 25 minuti"]',
  '["Preheat oven to 150°C (300°F)", "Beat egg whites with cream of tartar until stiff", "Add sugar gradually continuing to beat", "Add coloring if you want the TikTok pink", "Place on parchment paper forming an oval", "Bake 25 minutes"]',
  'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80',
  'tiktok', 'https://tiktok.com/@example/cloudbread', 'pink_food_lover',
  38000, 1700000, 15000, 5200,
  720.9, true, false,
  ARRAY['cloud bread', 'senza farina', 'tiktok', 'snack', 'facile', 'gluten free']
),

-- 9. Smash burger
(
  'Smash Burger: il Burger Croccante Americano Perfetto',
  'Smash Burger: The Perfect Crispy American Burger',
  'smash-burger-croccante-americano',
  'smash-burger-crispy-american-perfect',
  'La tecnica americana dello "schiacciamento" che crea una crosticina caramellata irresistibile. Meglio di qualsiasi fast food.',
  'The American "smashing" technique that creates an irresistible caramelized crust. Better than any fast food.',
  'secondi', 'facile',
  10, 10, 20, 2,
  '["300g carne macinata manzo (80/20)", "sale", "pepe", "2 fette cheddar", "2 panini brioche", "maionese", "ketchup", "cetriolini", "cipolla", "lattuga"]',
  '["300g ground beef (80/20)", "salt", "pepper", "2 cheddar slices", "2 brioche buns", "mayonnaise", "ketchup", "pickles", "onion", "lettuce"]',
  '["Forma 2 palline di carne senza compattare troppo", "Scalda la piastra/padella al massimo", "Metti la pallina di carne e schiacciala FORTE con una spatola", "Sali e pepa, cuoci 2 minuti senza muovere", "Gira, aggiungi il cheddar, cuoci 1 minuto", "Assembla il burger con tutte le guarnizioni"]',
  '["Form 2 meat balls without over-compressing", "Heat griddle/pan to maximum", "Place meat ball and SMASH it hard with a spatula", "Salt and pepper, cook 2 minutes without moving", "Flip, add cheddar, cook 1 minute", "Assemble burger with all toppings"]',
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
  'youtube', 'https://youtube.com/watch?v=smashburger', 'grill_master_yt',
  71000, 3800000, 29000, 12400,
  1560.2, true, false,
  ARRAY['burger', 'smash burger', 'americano', 'carne', 'youtube']
),

-- 10. Tiramisu originale
(
  'Tiramisù Originale (la Ricetta della Nonna Virale)',
  'Original Tiramisù (The Viral Grandma Recipe)',
  'tiramisu-originale-ricetta-nonna-virale',
  'original-tiramisu-viral-grandma-recipe',
  'La ricetta del tiramisù della nonna diventata virale con 20 milioni di visualizzazioni. Senza panna, uova fresche, autentica.',
  'The grandma tiramisù recipe that went viral with 20 million views. No cream, fresh eggs, authentic.',
  'dolci', 'medio',
  30, 0, 270, 8,
  '["6 uova fresche", "500g mascarpone", "100g zucchero", "400g savoiardi", "500ml caffè espresso freddo", "cacao amaro in polvere", "marsala o rum (opzionale)"]',
  '["6 fresh eggs", "500g mascarpone", "100g sugar", "400g ladyfinger biscuits", "500ml cold espresso", "unsweetened cocoa powder", "marsala or rum (optional)"]',
  '["Separa tuorli e albumi", "Monta i tuorli con lo zucchero fino a diventare chiari e spumosi", "Aggiungi il mascarpone ai tuorli", "Monta gli albumi a neve ferma", "Incorpora delicatamente gli albumi al mascarpone", "Inzuppa i savoiardi nel caffè (freddo!)", "Fai strati: savoiardi, crema, cacao. Ripeti", "Riposa in frigo almeno 4 ore"]',
  '["Separate yolks and whites", "Beat yolks with sugar until light and fluffy", "Add mascarpone to yolks", "Beat egg whites to stiff peaks", "Gently fold whites into mascarpone mixture", "Dip ladyfingers in coffee (cold!)", "Layer: ladyfingers, cream, cocoa. Repeat", "Rest in fridge at least 4 hours"]',
  'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80',
  'youtube', 'https://youtube.com/watch?v=tiramisu', 'nonna_italiana',
  134000, 9200000, 67000, 31000,
  2890.1, true, true,
  ARRAY['tiramisù', 'dolce', 'italiano', 'classico', 'virale', 'youtube']
),

-- 11. One pan pasta
(
  'One Pan Pasta: la Pasta in un''Unica Padella (Zero Pentole)',
  'One Pan Pasta: Pasta in a Single Pan (Zero Pots)',
  'one-pan-pasta-unica-padella',
  'one-pan-pasta-single-pan-zero-pots',
  'Tutta la pasta cotta in una sola padella con tutti gli ingredienti insieme. Meno piatti, più sapore.',
  'All pasta cooked in a single pan with all ingredients together. Fewer dishes, more flavor.',
  'primi', 'facile',
  5, 12, 17, 4,
  '["350g linguine", "400g pomodorini", "1 cipolla affettata", "4 spicchi aglio schiacciati", "peperoncino", "basilico fresco", "olio EVO", "850ml acqua", "sale"]',
  '["350g linguine", "400g cherry tomatoes", "1 sliced onion", "4 crushed garlic cloves", "chili pepper", "fresh basil", "extra virgin olive oil", "850ml water", "salt"]',
  '["Metti tutti gli ingredienti (tranne il basilico) in una padella larga", "Porta a ebollizione a fuoco alto mescolando spesso", "Cuoci 9-11 minuti finché l''''acqua è quasi del tutto assorbita", "L''''amido della pasta crea una salsa cremosa naturale", "Aggiungi basilico fresco e servi"]',
  '["Put all ingredients (except basil) in a wide pan", "Bring to boil over high heat stirring often", "Cook 9-11 minutes until water is almost fully absorbed", "Pasta starch creates a natural creamy sauce", "Add fresh basil and serve"]',
  'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&q=80',
  'instagram', 'https://instagram.com/p/onepan', 'quick_meals_ig',
  52000, 2400000, 21000, 8900,
  1040.5, true, false,
  ARRAY['pasta', 'one pan', 'facile', 'veloce', 'instagram']
),

-- 12. Banana bread
(
  'Banana Bread Virale: l''ha Fatto Tutto il Mondo nel Lockdown',
  'Viral Banana Bread: Everyone Made It During Lockdown',
  'banana-bread-virale-lockdown',
  'viral-banana-bread-lockdown',
  'La ricetta del banana bread che ha salvato le banane nere di tutta l''umanità durante il lockdown 2020. Umido, soffice, perfetto.',
  'The banana bread recipe that saved all humanity''s black bananas during the 2020 lockdown. Moist, fluffy, perfect.',
  'colazione', 'facile',
  15, 60, 75, 8,
  '["3 banane molto mature (nere)", "80g burro fuso", "150g zucchero di canna", "1 uovo", "1 cucchiaino vaniglia", "180g farina", "1 cucchiaino bicarbonato", "pizzico di sale", "opzionale: gocce di cioccolato, noci"]',
  '["3 very ripe (black) bananas", "80g melted butter", "150g brown sugar", "1 egg", "1 teaspoon vanilla", "180g flour", "1 teaspoon baking soda", "pinch of salt", "optional: chocolate chips, walnuts"]',
  '["Preriscalda il forno a 175°C", "Schiaccia le banane con una forchetta", "Aggiungi il burro fuso e mescola", "Aggiungi zucchero, uovo, vaniglia", "Incorpora farina, bicarbonato e sale", "Aggiungi gocce di cioccolato se vuoi", "Versa in uno stampo 23x13cm imburrato", "Cuoci 60-65 minuti"]',
  '["Preheat oven to 175°C (350°F)", "Mash bananas with a fork", "Add melted butter and mix", "Add sugar, egg, vanilla", "Fold in flour, baking soda and salt", "Add chocolate chips if desired", "Pour into greased 23x13cm loaf pan", "Bake 60-65 minutes"]',
  'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=800&q=80',
  'instagram', 'https://instagram.com/p/bananabread', 'baking_queen',
  88000, 4800000, 52000, 24000,
  2120.4, true, false,
  ARRAY['banana bread', 'colazione', 'dolce', 'lockdown', 'virale', 'facile']
),

-- 13. Eggs in a hole
(
  'Egg in a Hole: la Colazione Cinematografica che Spopola su Instagram',
  'Egg in a Hole: The Cinematic Breakfast Taking Over Instagram',
  'egg-in-a-hole-colazione-instagram',
  'egg-in-a-hole-cinematic-breakfast-instagram',
  'Il classico americano rinnovato con pane artigianale e uovo biologico. Pronto in 5 minuti, sembra una foto da ristorante.',
  'The American classic renewed with artisan bread and organic egg. Ready in 5 minutes, looks like a restaurant photo.',
  'colazione', 'facile',
  2, 5, 7, 1,
  '["1 fetta pane spesso (tipo brioche o pane artigianale)", "1 uovo", "burro", "sale", "pepe", "erba cipollina fresca"]',
  '["1 thick bread slice (brioche or artisan bread)", "1 egg", "butter", "salt", "pepper", "fresh chives"]',
  '["Taglia un cerchio al centro della fetta di pane", "Scalda il burro in padella a fuoco medio", "Metti la fetta di pane nella padella", "Rompi l''''uovo nel buco", "Cuoci 2-3 minuti per lato", "Sali, pepa e aggiungi erba cipollina"]',
  '["Cut a circle in the center of the bread slice", "Heat butter in pan over medium heat", "Place bread slice in pan", "Crack egg into the hole", "Cook 2-3 minutes per side", "Salt, pepper and add chives"]',
  'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80',
  'instagram', 'https://instagram.com/p/egghole', 'breakfast_aesthetic',
  31000, 1400000, 11000, 4600,
  580.3, true, false,
  ARRAY['uova', 'colazione', 'instagram', 'facile', 'veloce']
),

-- 14. Focaccia barese
(
  'Focaccia Barese Originale (la Vera Ricetta Pugliese Virale)',
  'Original Barese Focaccia (The Viral Authentic Puglia Recipe)',
  'focaccia-barese-originale-pugliese-virale',
  'original-barese-focaccia-viral-puglia-recipe',
  'La focaccia di Bari con patate nell''impasto, pomodorini, olive e origano. Croccante fuori, soffice dentro. La migliore del mondo.',
  'Bari focaccia with potatoes in the dough, cherry tomatoes, olives and oregano. Crispy outside, fluffy inside. The best in the world.',
  'antipasti', 'medio',
  30, 25, 175, 8,
  '["500g farina 0", "1 patata media lessa schiacciata", "300ml acqua tiepida", "7g lievito secco", "10g sale", "100ml olio EVO + altro per la teglia", "pomodorini ciliegino", "olive nere", "origano", "sale grosso"]',
  '["500g bread flour", "1 medium boiled mashed potato", "300ml warm water", "7g dry yeast", "10g salt", "100ml extra virgin olive oil + more for pan", "cherry tomatoes", "black olives", "oregano", "coarse salt"]',
  '["Sciogli il lievito in acqua tiepida con un pizzico di zucchero", "Mescola farina, patata schiacciata e sale", "Aggiungi acqua con lievito e olio", "Impasta fino a ottenere un impasto liscio", "Lascia lievitare 1.5-2 ore coperto", "Stendi in teglia unta abbondantemente", "Fai i buchi con le dita, aggiungi pomodorini, olive, origano e sale grosso", "Cuoci a 220°C per 25 minuti"]',
  '["Dissolve yeast in warm water with a pinch of sugar", "Mix flour, mashed potato and salt", "Add yeast water and oil", "Knead until smooth dough forms", "Let rise 1.5-2 hours covered", "Spread in generously oiled pan", "Make holes with fingers, add tomatoes, olives, oregano and coarse salt", "Bake at 220°C (430°F) for 25 minutes"]',
  'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80',
  'youtube', 'https://youtube.com/watch?v=focaccia', 'cucina_puglia',
  76000, 3600000, 38000, 14500,
  1620.8, true, false,
  ARRAY['focaccia', 'barese', 'puglia', 'pane', 'virale', 'youtube']
),

-- 15. Avocado toast
(
  'Avocado Toast Perfetto: la Colazione da 1 Milione di Like',
  'Perfect Avocado Toast: The 1 Million Likes Breakfast',
  'avocado-toast-perfetto-milione-like',
  'perfect-avocado-toast-million-likes',
  'La ricetta definitiva dell''avocado toast: avocado condito nel modo giusto, pane tostato croccante, uovo in camicia perfetto.',
  'The definitive avocado toast recipe: avocado seasoned the right way, crispy toasted bread, perfect poached egg.',
  'colazione', 'facile',
  5, 5, 10, 1,
  '["2 fette pane integrale o di segale", "1 avocado maturo", "1 uovo (per la versione con poached egg)", "succo di limone", "sale marino in fiocchi", "peperoncino in fiocchi", "olio EVO", "microgreens o erba cipollina"]',
  '["2 whole grain or rye bread slices", "1 ripe avocado", "1 egg (for poached egg version)", "lemon juice", "flaky sea salt", "chili flakes", "extra virgin olive oil", "microgreens or chives"]',
  '["Tosta il pane fino a renderlo croccante", "Schiaccia l''''avocado con succo di limone e sale", "Spalma l''''avocado sul pane", "Per il poached egg: rompi l''''uovo in acqua con aceto che fa il mulinello", "Cuoci 3 minuti, asciuga l''''uovo", "Metti l''''uovo sull''''avocado, aggiungi fiocchi di sale e peperoncino"]',
  '["Toast bread until crispy", "Mash avocado with lemon juice and salt", "Spread avocado on toast", "For poached egg: crack egg into water with vinegar making a swirl", "Cook 3 minutes, dry the egg", "Place egg on avocado, add salt flakes and chili flakes"]',
  'https://images.unsplash.com/photo-1603046891744-1f5e7c1d7a3b?w=800&q=80',
  'instagram', 'https://instagram.com/p/avotoast', 'healthy_foodie_ig',
  95000, 5200000, 44000, 19000,
  2240.6, true, false,
  ARRAY['avocado toast', 'colazione', 'instagram', 'healthy', 'virale', 'facile']
);

-- Aggiorna i viral score calcolati
UPDATE recipes SET viral_score = (votes_count * 3 + views_count * 0.1 + saves_count * 5 + made_count * 10) / POWER(1, 1.2)
WHERE viral_score > 0;

SELECT COUNT(*) as ricette_inserite FROM recipes WHERE is_published = TRUE;
