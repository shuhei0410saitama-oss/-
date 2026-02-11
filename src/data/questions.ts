export interface QuestionOption {
  id: "A" | "B" | "C" | "D";
  text: string;
  textJa: string;
}

export interface Question {
  id: number;
  topicSlug: string;
  type: "mc";
  question: string;
  questionJa: string;
  options: QuestionOption[];
  correctAnswer: "A" | "B" | "C" | "D";
  explanation: string;
  explanationJa: string;
  difficulty: 1 | 2 | 3;
}

export const questions: Question[] = [
  // ============================================================
  // Revenue Recognition (ASC 606) - 3 questions
  // ============================================================
  {
    id: 1,
    topicSlug: "revenue-recognition",
    type: "mc",
    question:
      "Under ASC 606, which of the following is the correct order of the five-step revenue recognition model?",
    questionJa:
      "ASC 606における5ステップの収益認識モデルの正しい順序はどれですか？",
    options: [
      {
        id: "A",
        text: "Identify the contract, Identify performance obligations, Determine transaction price, Allocate transaction price, Recognize revenue",
        textJa:
          "契約の識別、履行義務の識別、取引価格の決定、取引価格の配分、収益の認識",
      },
      {
        id: "B",
        text: "Identify performance obligations, Identify the contract, Determine transaction price, Recognize revenue, Allocate transaction price",
        textJa:
          "履行義務の識別、契約の識別、取引価格の決定、収益の認識、取引価格の配分",
      },
      {
        id: "C",
        text: "Determine transaction price, Identify the contract, Identify performance obligations, Allocate transaction price, Recognize revenue",
        textJa:
          "取引価格の決定、契約の識別、履行義務の識別、取引価格の配分、収益の認識",
      },
      {
        id: "D",
        text: "Identify the contract, Determine transaction price, Identify performance obligations, Recognize revenue, Allocate transaction price",
        textJa:
          "契約の識別、取引価格の決定、履行義務の識別、収益の認識、取引価格の配分",
      },
    ],
    correctAnswer: "A",
    explanation:
      "The five-step model under ASC 606 follows this specific order: (1) Identify the contract with the customer, (2) Identify the performance obligations in the contract, (3) Determine the transaction price, (4) Allocate the transaction price to the performance obligations, and (5) Recognize revenue when (or as) the entity satisfies a performance obligation.",
    explanationJa:
      "ASC 606の5ステップモデルは以下の順序に従います：(1)顧客との契約を識別する、(2)契約における履行義務を識別する、(3)取引価格を決定する、(4)取引価格を履行義務に配分する、(5)履行義務を充足した時点で（または充足するにつれて）収益を認識する。この順序は基準で明確に定められています。",
    difficulty: 1,
  },
  {
    id: 2,
    topicSlug: "revenue-recognition",
    type: "mc",
    question:
      "A software company enters into a contract to deliver a software license and provide two years of post-contract support (PCS) for a total price of $120,000. The standalone selling price of the license is $90,000 and the PCS is $50,000. How much revenue should be allocated to the software license?",
    questionJa:
      "ソフトウェア会社がソフトウェアライセンスの提供と2年間のサポートサービス（PCS）を合計$120,000で契約しました。ライセンスの独立販売価格は$90,000、PCSの独立販売価格は$50,000です。ソフトウェアライセンスに配分すべき収益はいくらですか？",
    options: [
      {
        id: "A",
        text: "$90,000",
        textJa: "$90,000",
      },
      {
        id: "B",
        text: "$77,143",
        textJa: "$77,143",
      },
      {
        id: "C",
        text: "$60,000",
        textJa: "$60,000",
      },
      {
        id: "D",
        text: "$70,000",
        textJa: "$70,000",
      },
    ],
    correctAnswer: "B",
    explanation:
      "Under ASC 606, the transaction price is allocated based on relative standalone selling prices. The total standalone selling prices are $90,000 + $50,000 = $140,000. The allocation to the license is $120,000 x ($90,000 / $140,000) = $120,000 x 0.6429 = $77,143 (rounded).",
    explanationJa:
      "ASC 606では、取引価格は独立販売価格の比率に基づいて配分されます。独立販売価格の合計は$90,000 + $50,000 = $140,000です。ライセンスへの配分額は$120,000 × ($90,000 ÷ $140,000) = $120,000 × 0.6429 = $77,143（四捨五入）となります。",
    difficulty: 2,
  },
  {
    id: 3,
    topicSlug: "revenue-recognition",
    type: "mc",
    question:
      "Under ASC 606, a performance obligation is satisfied over time if which of the following criteria is met?",
    questionJa:
      "ASC 606において、以下のどの基準を満たす場合、履行義務は一定の期間にわたり充足されますか？",
    options: [
      {
        id: "A",
        text: "The customer receives and consumes the benefits as the entity performs.",
        textJa:
          "企業が履行するにつれて、顧客が便益を同時に受け取り消費する。",
      },
      {
        id: "B",
        text: "The entity has a present right to payment for the asset at any point during the contract.",
        textJa:
          "契約期間中のいかなる時点においても、企業が資産に対する現在の支払請求権を有する。",
      },
      {
        id: "C",
        text: "The performance obligation must always be satisfied at a point in time if the asset has an alternative use.",
        textJa:
          "資産に代替的な用途がある場合、履行義務は常に一時点で充足されなければならない。",
      },
      {
        id: "D",
        text: "Both A and B are valid criteria for over-time recognition; only one needs to be met.",
        textJa:
          "AとBの両方が期間にわたる認識の有効な基準であり、いずれか一つを満たせばよい。",
      },
    ],
    correctAnswer: "D",
    explanation:
      "ASC 606 specifies three criteria for over-time recognition (any one of which is sufficient): (1) the customer simultaneously receives and consumes the benefits, (2) the entity's performance creates or enhances an asset the customer controls, or (3) the entity's performance does not create an asset with an alternative use and the entity has an enforceable right to payment for performance completed to date. Options A and B each describe one valid criterion.",
    explanationJa:
      "ASC 606は一定期間にわたる収益認識の3つの基準を規定しており、いずれか1つを満たせば十分です：(1)顧客が便益を同時に受取り消費する、(2)企業の履行により顧客が支配する資産が創出・増価される、(3)企業の履行により代替用途のない資産が創出され、かつ完了済みの履行に対する支払請求権を有する。選択肢AとBはそれぞれ有効な基準の一つを記述しています。",
    difficulty: 3,
  },

  // ============================================================
  // Inventory (LIFO/FIFO/Weighted Average) - 3 questions
  // ============================================================
  {
    id: 4,
    topicSlug: "inventory",
    type: "mc",
    question:
      "A company uses the FIFO method and has the following inventory data: Beginning inventory: 100 units @ $10; Purchase 1: 200 units @ $12; Purchase 2: 150 units @ $14. If 280 units were sold, what is the cost of goods sold?",
    questionJa:
      "FIFO法を採用している企業の棚卸資産データは以下の通りです：期首在庫100個@$10、仕入1: 200個@$12、仕入2: 150個@$14。280個が販売された場合、売上原価はいくらですか？",
    options: [
      {
        id: "A",
        text: "$3,160",
        textJa: "$3,160",
      },
      {
        id: "B",
        text: "$3,400",
        textJa: "$3,400",
      },
      {
        id: "C",
        text: "$3,360",
        textJa: "$3,360",
      },
      {
        id: "D",
        text: "$3,240",
        textJa: "$3,240",
      },
    ],
    correctAnswer: "A",
    explanation:
      "Under FIFO, the oldest costs are assigned to COGS first. COGS = (100 x $10) + (180 x $12) = $1,000 + $2,160 = $3,160. The first 100 units come from beginning inventory at $10 each, and the remaining 180 units come from Purchase 1 at $12 each.",
    explanationJa:
      "FIFO法では、最も古い原価から先に売上原価に算入されます。売上原価 = (100個 × $10) + (180個 × $12) = $1,000 + $2,160 = $3,160。最初の100個は期首在庫の@$10から、残りの180個は仕入1の@$12から充当されます。",
    difficulty: 1,
  },
  {
    id: 5,
    topicSlug: "inventory",
    type: "mc",
    question:
      "During a period of rising prices, which inventory method will result in the highest net income?",
    questionJa:
      "物価上昇期において、最も高い当期純利益をもたらす棚卸資産評価方法はどれですか？",
    options: [
      {
        id: "A",
        text: "LIFO",
        textJa: "LIFO（後入先出法）",
      },
      {
        id: "B",
        text: "FIFO",
        textJa: "FIFO（先入先出法）",
      },
      {
        id: "C",
        text: "Weighted average",
        textJa: "加重平均法",
      },
      {
        id: "D",
        text: "Specific identification",
        textJa: "個別法",
      },
    ],
    correctAnswer: "B",
    explanation:
      "During periods of rising prices, FIFO assigns the oldest (lowest) costs to COGS, resulting in the lowest COGS and therefore the highest gross profit and net income. LIFO would assign the newest (highest) costs to COGS, resulting in the lowest net income. Weighted average falls between FIFO and LIFO.",
    explanationJa:
      "物価上昇期には、FIFO法は最も古い（最も低い）原価を売上原価に算入するため、売上原価が最も低くなり、結果として売上総利益と当期純利益が最も高くなります。LIFO法は最も新しい（最も高い）原価を売上原価に算入するため、当期純利益が最も低くなります。加重平均法はFIFOとLIFOの中間に位置します。",
    difficulty: 1,
  },
  {
    id: 6,
    topicSlug: "inventory",
    type: "mc",
    question:
      "A company has inventory with a cost of $50,000, a replacement cost of $42,000, a net realizable value (NRV) of $45,000, and NRV less a normal profit margin of $38,000. Under US GAAP (non-LIFO), at what amount should the inventory be reported on the balance sheet?",
    questionJa:
      "ある企業の棚卸資産の原価は$50,000、再調達原価は$42,000、正味実現可能価額（NRV）は$45,000、NRVから正常利益を控除した額は$38,000です。US GAAP（非LIFO）の下で、棚卸資産を貸借対照表にいくらで報告すべきですか？",
    options: [
      {
        id: "A",
        text: "$50,000",
        textJa: "$50,000",
      },
      {
        id: "B",
        text: "$45,000",
        textJa: "$45,000",
      },
      {
        id: "C",
        text: "$42,000",
        textJa: "$42,000",
      },
      {
        id: "D",
        text: "$38,000",
        textJa: "$38,000",
      },
    ],
    correctAnswer: "B",
    explanation:
      "Under ASU 2015-11, for non-LIFO inventory, the lower of cost or net realizable value (LCNRV) is applied. NRV is $45,000, which is lower than cost of $50,000, so inventory is reported at $45,000. The ceiling/floor approach (using replacement cost) only applies to LIFO and retail inventory method.",
    explanationJa:
      "ASU 2015-11の下では、非LIFO棚卸資産には原価とNRVの低い方（LCNRV）が適用されます。NRVは$45,000で原価$50,000より低いため、棚卸資産は$45,000で報告されます。上限・下限アプローチ（再調達原価を使用）はLIFO法および小売棚卸法にのみ適用されます。",
    difficulty: 2,
  },

  // ============================================================
  // Bonds Payable - 3 questions
  // ============================================================
  {
    id: 7,
    topicSlug: "bonds-payable",
    type: "mc",
    question:
      "A company issues $500,000 of 10-year bonds with a stated rate of 8% when the market rate is 10%. The bonds pay interest semiannually. Which of the following is true about this bond issuance?",
    questionJa:
      "ある企業が市場金利10%の時に表面利率8%の10年満期社債$500,000を発行しました。利息は半年ごとに支払われます。この社債の発行について正しいのはどれですか？",
    options: [
      {
        id: "A",
        text: "The bonds are issued at a premium because the stated rate exceeds the market rate.",
        textJa:
          "表面利率が市場金利を上回るため、プレミアム発行となる。",
      },
      {
        id: "B",
        text: "The bonds are issued at a discount, and interest expense each period will exceed the cash interest payment.",
        textJa:
          "ディスカウント発行となり、各期の利息費用は現金利息支払額を上回る。",
      },
      {
        id: "C",
        text: "The bonds are issued at par because the stated rate and market rate are within 2% of each other.",
        textJa:
          "表面利率と市場金利の差が2%以内であるため、額面発行となる。",
      },
      {
        id: "D",
        text: "The bonds are issued at a discount, and interest expense each period will be less than the cash interest payment.",
        textJa:
          "ディスカウント発行となり、各期の利息費用は現金利息支払額を下回る。",
      },
    ],
    correctAnswer: "B",
    explanation:
      "When the stated rate (8%) is less than the market rate (10%), bonds are issued at a discount (below face value). Under the effective interest method, interest expense = carrying amount x market rate. Since the carrying amount is below face value and the market rate exceeds the stated rate, interest expense each period exceeds the cash interest payment ($500,000 x 8% / 2 = $20,000). The difference is the discount amortization, which increases the carrying amount toward face value.",
    explanationJa:
      "表面利率（8%）が市場金利（10%）を下回る場合、社債はディスカウント（額面以下）で発行されます。実効金利法では、利息費用 = 帳簿価額 × 市場金利です。帳簿価額は額面未満であり市場金利が表面利率を超えるため、各期の利息費用は現金利息支払額（$500,000 × 8% ÷ 2 = $20,000）を上回ります。差額がディスカウントの償却額であり、帳簿価額は満期に向けて額面に近づきます。",
    difficulty: 2,
  },
  {
    id: 8,
    topicSlug: "bonds-payable",
    type: "mc",
    question:
      "On January 1, Year 1, a company issues $1,000,000 face value bonds at 103. The bonds mature in 5 years and pay 6% interest annually. Using straight-line amortization, what is the interest expense for Year 1?",
    questionJa:
      "第1年度の1月1日に、企業が額面$1,000,000の社債を103で発行しました。社債は5年満期で、年6%の利息を毎年支払います。定額法を使用した場合、第1年度の利息費用はいくらですか？",
    options: [
      {
        id: "A",
        text: "$60,000",
        textJa: "$60,000",
      },
      {
        id: "B",
        text: "$54,000",
        textJa: "$54,000",
      },
      {
        id: "C",
        text: "$66,000",
        textJa: "$66,000",
      },
      {
        id: "D",
        text: "$63,000",
        textJa: "$63,000",
      },
    ],
    correctAnswer: "B",
    explanation:
      "The bonds were issued at 103, meaning the issue price is $1,030,000. The premium is $1,030,000 - $1,000,000 = $30,000. Under straight-line amortization, the annual premium amortization is $30,000 / 5 = $6,000. Interest expense = Cash interest - Premium amortization = ($1,000,000 x 6%) - $6,000 = $60,000 - $6,000 = $54,000.",
    explanationJa:
      "社債は103で発行されたため、発行価額は$1,030,000です。プレミアムは$1,030,000 - $1,000,000 = $30,000です。定額法によるプレミアムの年間償却額は$30,000 ÷ 5 = $6,000です。利息費用 = 現金利息 - プレミアム償却額 = ($1,000,000 × 6%) - $6,000 = $60,000 - $6,000 = $54,000となります。",
    difficulty: 2,
  },
  {
    id: 9,
    topicSlug: "bonds-payable",
    type: "mc",
    question:
      "A company retires $500,000 face value bonds at 98. The bonds have an unamortized discount of $15,000 at the date of retirement. What is the gain or loss on retirement?",
    questionJa:
      "企業が額面$500,000の社債を98で償還しました。償還日時点の未償却ディスカウントは$15,000です。償還損益はいくらですか？",
    options: [
      {
        id: "A",
        text: "$5,000 gain",
        textJa: "$5,000の利益",
      },
      {
        id: "B",
        text: "$5,000 loss",
        textJa: "$5,000の損失",
      },
      {
        id: "C",
        text: "$25,000 loss",
        textJa: "$25,000の損失",
      },
      {
        id: "D",
        text: "$25,000 gain",
        textJa: "$25,000の利益",
      },
    ],
    correctAnswer: "B",
    explanation:
      "The carrying amount of the bonds = Face value - Unamortized discount = $500,000 - $15,000 = $485,000. The retirement price = $500,000 x 98% = $490,000. Since the company pays $490,000 to retire bonds with a carrying amount of $485,000, the loss on retirement = $490,000 - $485,000 = $5,000.",
    explanationJa:
      "社債の帳簿価額 = 額面 - 未償却ディスカウント = $500,000 - $15,000 = $485,000。償還価額 = $500,000 × 98% = $490,000。企業は帳簿価額$485,000の社債を$490,000で償還するため、償還損失 = $490,000 - $485,000 = $5,000の損失が発生します。",
    difficulty: 3,
  },

  // ============================================================
  // Lease Accounting (ASC 842) - 3 questions
  // ============================================================
  {
    id: 10,
    topicSlug: "lease-accounting",
    type: "mc",
    question:
      "Under ASC 842, which of the following is NOT one of the five criteria used to classify a lease as a finance lease for the lessee?",
    questionJa:
      "ASC 842において、借手がリースをファイナンスリースに分類するための5つの基準に含まれないのはどれですか？",
    options: [
      {
        id: "A",
        text: "The lease transfers ownership of the underlying asset to the lessee by the end of the lease term.",
        textJa:
          "リース期間終了までに原資産の所有権が借手に移転する。",
      },
      {
        id: "B",
        text: "The lease grants the lessee a bargain purchase option.",
        textJa: "借手に割安購入選択権が付与されている。",
      },
      {
        id: "C",
        text: "The present value of lease payments equals or exceeds 75% of the fair value of the underlying asset.",
        textJa:
          "リース料の現在価値が原資産の公正価値の75%以上である。",
      },
      {
        id: "D",
        text: "The lease requires the lessee to guarantee the residual value of the underlying asset.",
        textJa:
          "リースにおいて借手が原資産の残存価値を保証することが要求されている。",
      },
    ],
    correctAnswer: "D",
    explanation:
      "The five criteria for finance lease classification under ASC 842 are: (1) transfer of ownership, (2) bargain purchase option, (3) lease term is for the major part of the remaining economic life, (4) present value of lease payments substantially equals the fair value, and (5) the underlying asset is of a specialized nature. A residual value guarantee by the lessee is not one of the classification criteria, although it is included in the measurement of the lease liability.",
    explanationJa:
      "ASC 842におけるファイナンスリースの5つの分類基準は：(1)所有権の移転、(2)割安購入選択権、(3)リース期間が経済的耐用年数の大部分を占める、(4)リース料の現在価値が公正価値のほぼ全部に相当する、(5)原資産が特殊な性質を持つ、です。借手による残存価値保証は分類基準ではありませんが、リース負債の測定には含まれます。",
    difficulty: 2,
  },
  {
    id: 11,
    topicSlug: "lease-accounting",
    type: "mc",
    question:
      "Under ASC 842, a lessee enters into a 5-year operating lease with annual payments of $10,000 due at the end of each year. The lessee's incremental borrowing rate is 6%. The present value of an ordinary annuity of $1 for 5 periods at 6% is 4.21236. What is the initial right-of-use (ROU) asset and lease liability?",
    questionJa:
      "ASC 842の下で、借手が年間リース料$10,000（各年末払い）の5年間のオペレーティングリースを締結しました。借手の追加借入利子率は6%です。6%・5期間の年金現価係数は4.21236です。使用権（ROU）資産とリース負債の当初計上額はいくらですか？",
    options: [
      {
        id: "A",
        text: "$50,000 for both ROU asset and lease liability",
        textJa: "ROU資産・リース負債ともに$50,000",
      },
      {
        id: "B",
        text: "$42,124 for both ROU asset and lease liability",
        textJa: "ROU資産・リース負債ともに$42,124",
      },
      {
        id: "C",
        text: "$42,124 for lease liability and $50,000 for ROU asset",
        textJa: "リース負債$42,124、ROU資産$50,000",
      },
      {
        id: "D",
        text: "$42,124 for lease liability and $10,000 for ROU asset",
        textJa: "リース負債$42,124、ROU資産$10,000",
      },
    ],
    correctAnswer: "B",
    explanation:
      "The lease liability is measured at the present value of lease payments: $10,000 x 4.21236 = $42,124 (rounded). The ROU asset initially equals the lease liability plus any initial direct costs and prepaid lease payments, minus any lease incentives received. With no additional adjustments mentioned, the ROU asset equals the lease liability at $42,124.",
    explanationJa:
      "リース負債はリース料の現在価値で測定されます：$10,000 × 4.21236 = $42,124（四捨五入）。ROU資産は当初、リース負債に初期直接費用と前払リース料を加え、リース・インセンティブを控除した額に等しくなります。追加の調整項目がない場合、ROU資産はリース負債と同額の$42,124となります。",
    difficulty: 2,
  },
  {
    id: 12,
    topicSlug: "lease-accounting",
    type: "mc",
    question:
      "For a lessee, what is the primary difference in expense recognition between a finance lease and an operating lease under ASC 842?",
    questionJa:
      "ASC 842において、借手のファイナンスリースとオペレーティングリースの費用認識の主な違いは何ですか？",
    options: [
      {
        id: "A",
        text: "A finance lease recognizes a single straight-line lease expense, while an operating lease recognizes separate amortization and interest expense.",
        textJa:
          "ファイナンスリースは単一の定額リース費用を認識し、オペレーティングリースは償却費と利息費用を別々に認識する。",
      },
      {
        id: "B",
        text: "A finance lease recognizes separate amortization and interest expense (front-loaded total expense), while an operating lease recognizes a single straight-line lease expense.",
        textJa:
          "ファイナンスリースは償却費と利息費用を別々に認識し（費用総額は前倒し）、オペレーティングリースは単一の定額リース費用を認識する。",
      },
      {
        id: "C",
        text: "There is no difference in expense recognition; both types recognize the same total expense over the lease term.",
        textJa:
          "費用認識に違いはなく、両方ともリース期間にわたって同額の費用を認識する。",
      },
      {
        id: "D",
        text: "Operating leases do not appear on the balance sheet, so no expense is recognized.",
        textJa:
          "オペレーティングリースは貸借対照表に計上されないため、費用は認識されない。",
      },
    ],
    correctAnswer: "B",
    explanation:
      "Under ASC 842, a finance lease lessee recognizes amortization of the ROU asset and interest on the lease liability separately, resulting in higher total expense in earlier years (front-loaded pattern). An operating lease lessee recognizes a single straight-line lease expense over the lease term. Note that under ASC 842, both finance and operating leases are recognized on the balance sheet.",
    explanationJa:
      "ASC 842では、ファイナンスリースの借手はROU資産の償却費とリース負債の利息費用を別々に認識するため、リース期間の前半に費用が多くなります（前倒しパターン）。オペレーティングリースの借手はリース期間にわたって単一の定額リース費用を認識します。なお、ASC 842ではファイナンスリースもオペレーティングリースも貸借対照表に計上されます。",
    difficulty: 2,
  },

  // ============================================================
  // Cash Flow Statement - 3 questions
  // ============================================================
  {
    id: 13,
    topicSlug: "cash-flow-statement",
    type: "mc",
    question:
      "Under US GAAP, which of the following items is classified as a financing activity on the statement of cash flows?",
    questionJa:
      "US GAAPにおいて、キャッシュ・フロー計算書で財務活動に分類されるのはどれですか？",
    options: [
      {
        id: "A",
        text: "Cash received from interest on investments",
        textJa: "投資から受け取った利息",
      },
      {
        id: "B",
        text: "Cash paid for dividends to shareholders",
        textJa: "株主への配当金の支払い",
      },
      {
        id: "C",
        text: "Cash paid for interest on debt",
        textJa: "借入金の利息の支払い",
      },
      {
        id: "D",
        text: "Cash received from sale of equipment",
        textJa: "設備の売却による現金受取",
      },
    ],
    correctAnswer: "B",
    explanation:
      "Under US GAAP, dividends paid to shareholders are classified as financing activities. Interest received and interest paid are both classified as operating activities under US GAAP. Cash from the sale of equipment is an investing activity. This is a key difference from IFRS, where entities have more flexibility in classifying interest and dividends.",
    explanationJa:
      "US GAAPでは、株主への配当金の支払いは財務活動に分類されます。受取利息と支払利息はUS GAAPでは営業活動に分類されます。設備の売却による現金受取は投資活動です。これはIFRSとの重要な相違点であり、IFRSでは利息と配当の分類についてより柔軟性があります。",
    difficulty: 1,
  },
  {
    id: 14,
    topicSlug: "cash-flow-statement",
    type: "mc",
    question:
      "When preparing the operating section of the cash flow statement using the indirect method, which of the following adjustments is correct?",
    questionJa:
      "間接法によるキャッシュ・フロー計算書の営業活動セクションを作成する際、正しい調整はどれですか？",
    options: [
      {
        id: "A",
        text: "Add a gain on sale of equipment to net income.",
        textJa: "設備売却益を当期純利益に加算する。",
      },
      {
        id: "B",
        text: "Subtract an increase in accounts receivable from net income.",
        textJa: "売掛金の増加額を当期純利益から減算する。",
      },
      {
        id: "C",
        text: "Subtract depreciation expense from net income.",
        textJa: "減価償却費を当期純利益から減算する。",
      },
      {
        id: "D",
        text: "Add an increase in accounts payable and subtract depreciation expense.",
        textJa:
          "買掛金の増加額を加算し、減価償却費を減算する。",
      },
    ],
    correctAnswer: "B",
    explanation:
      "Under the indirect method: (1) Depreciation is added back (non-cash expense), (2) Gains on sale of assets are subtracted (the cash is in investing, not operating), (3) Increases in current assets (like A/R) are subtracted because cash was not collected, (4) Increases in current liabilities (like A/P) are added because cash was not paid. Therefore, subtracting an increase in accounts receivable is the correct adjustment.",
    explanationJa:
      "間接法では：(1)減価償却費は加算（非現金費用）、(2)資産売却益は減算（現金は投資活動に含まれる）、(3)流動資産の増加（売掛金など）は減算（現金が回収されていない）、(4)流動負債の増加（買掛金など）は加算（現金が支払われていない）。したがって、売掛金の増加額を減算するのが正しい調整です。",
    difficulty: 1,
  },
  {
    id: 15,
    topicSlug: "cash-flow-statement",
    type: "mc",
    question:
      "A company reports net income of $200,000. During the year, depreciation was $30,000, accounts receivable increased by $15,000, inventory decreased by $8,000, accounts payable decreased by $12,000, and there was a $5,000 gain on sale of equipment. What is the net cash provided by operating activities using the indirect method?",
    questionJa:
      "企業の当期純利益は$200,000です。年度中に減価償却費$30,000、売掛金増加$15,000、棚卸資産減少$8,000、買掛金減少$12,000、設備売却益$5,000がありました。間接法による営業活動によるキャッシュ・フローはいくらですか？",
    options: [
      {
        id: "A",
        text: "$206,000",
        textJa: "$206,000",
      },
      {
        id: "B",
        text: "$216,000",
        textJa: "$216,000",
      },
      {
        id: "C",
        text: "$196,000",
        textJa: "$196,000",
      },
      {
        id: "D",
        text: "$226,000",
        textJa: "$226,000",
      },
    ],
    correctAnswer: "A",
    explanation:
      "Operating cash flow (indirect method): Net income $200,000 + Depreciation $30,000 - Gain on sale $5,000 - Increase in A/R $15,000 + Decrease in inventory $8,000 - Decrease in A/P $12,000 = $206,000. Depreciation is added back as a non-cash expense. The gain is subtracted because the cash from the sale is classified under investing activities. A/R increase means less cash collected, inventory decrease means cash was freed up, and A/P decrease means more cash was paid out.",
    explanationJa:
      "営業キャッシュ・フロー（間接法）：当期純利益$200,000 + 減価償却費$30,000 - 売却益$5,000 - 売掛金増加$15,000 + 棚卸資産減少$8,000 - 買掛金減少$12,000 = $206,000。減価償却費は非現金費用として加算。売却益は投資活動に関連する現金のため減算。売掛金増加は現金未回収を意味し減算。棚卸資産減少は現金の解放を意味し加算。買掛金減少は現金流出を意味し減算。",
    difficulty: 2,
  },

  // ============================================================
  // Deferred Tax Assets/Liabilities - 3 questions
  // ============================================================
  {
    id: 16,
    topicSlug: "deferred-tax",
    type: "mc",
    question:
      "A company has a book basis of $100,000 for a depreciable asset and a tax basis of $60,000. The enacted tax rate is 25%. What deferred tax amount should be recognized?",
    questionJa:
      "企業の減価償却資産の会計上の帳簿価額は$100,000、税務上の簿価は$60,000です。制定税率は25%です。認識すべき繰延税金はいくらですか？",
    options: [
      {
        id: "A",
        text: "$10,000 deferred tax asset",
        textJa: "$10,000の繰延税金資産",
      },
      {
        id: "B",
        text: "$10,000 deferred tax liability",
        textJa: "$10,000の繰延税金負債",
      },
      {
        id: "C",
        text: "$40,000 deferred tax liability",
        textJa: "$40,000の繰延税金負債",
      },
      {
        id: "D",
        text: "$15,000 deferred tax asset",
        textJa: "$15,000の繰延税金資産",
      },
    ],
    correctAnswer: "B",
    explanation:
      "The book basis ($100,000) exceeds the tax basis ($60,000) for an asset, creating a taxable temporary difference of $40,000. This means the company has taken more depreciation for tax purposes than for book purposes, and will have higher taxable income in the future when the asset is recovered. The deferred tax liability = $40,000 x 25% = $10,000.",
    explanationJa:
      "資産の会計上の帳簿価額（$100,000）が税務上の簿価（$60,000）を上回っており、$40,000の将来加算一時差異が生じています。これは税務上の方が多く減価償却を行っているため、将来資産を回収する際に課税所得が増加することを意味します。繰延税金負債 = $40,000 × 25% = $10,000となります。",
    difficulty: 1,
  },
  {
    id: 17,
    topicSlug: "deferred-tax",
    type: "mc",
    question:
      "Which of the following is a permanent difference that does NOT give rise to a deferred tax asset or liability?",
    questionJa:
      "以下のうち、繰延税金資産または負債を生じさせない永久差異はどれですか？",
    options: [
      {
        id: "A",
        text: "Warranty expense accrued for book purposes but deducted for tax when paid",
        textJa:
          "会計上は見積計上するが、税務上は支払時に控除する保証費用",
      },
      {
        id: "B",
        text: "Depreciation differences due to different methods for book and tax",
        textJa:
          "会計と税務で異なる償却方法による減価償却費の差異",
      },
      {
        id: "C",
        text: "Interest income on municipal bonds that is exempt from federal taxation",
        textJa: "連邦税が免除される地方債の利息収入",
      },
      {
        id: "D",
        text: "Rent received in advance that is taxable when received but recognized as revenue over time for book purposes",
        textJa:
          "税務上は受領時に課税されるが、会計上は期間にわたり収益認識する前受賃貸料",
      },
    ],
    correctAnswer: "C",
    explanation:
      "Interest on municipal bonds is exempt from federal income tax and is never taxable, making it a permanent difference. Permanent differences affect the effective tax rate but do not create deferred tax assets or liabilities because they never reverse. Options A, B, and D are all temporary differences that will reverse in future periods and therefore give rise to deferred tax assets or liabilities.",
    explanationJa:
      "地方債の利息は連邦所得税が免除され、将来も課税されることがないため永久差異です。永久差異は実効税率に影響しますが、将来反転しないため繰延税金資産・負債は生じません。選択肢A（保証費用）、B（減価償却差異）、D（前受賃貸料）はいずれも将来反転する一時差異であり、繰延税金資産または負債を生じさせます。",
    difficulty: 1,
  },
  {
    id: 18,
    topicSlug: "deferred-tax",
    type: "mc",
    question:
      "A company has a deferred tax asset of $50,000. Management determines that it is more likely than not that only $30,000 of the DTA will be realized. The enacted tax rate changes from 30% to 25%. Before considering the rate change, what valuation allowance should be recorded?",
    questionJa:
      "企業に$50,000の繰延税金資産があります。経営陣はDTAのうち$30,000のみが実現する可能性が高い（more likely than not）と判断しました。制定税率が30%から25%に変更される前に、いくらの評価性引当金を計上すべきですか？",
    options: [
      {
        id: "A",
        text: "$50,000",
        textJa: "$50,000",
      },
      {
        id: "B",
        text: "$30,000",
        textJa: "$30,000",
      },
      {
        id: "C",
        text: "$20,000",
        textJa: "$20,000",
      },
      {
        id: "D",
        text: "$0",
        textJa: "$0",
      },
    ],
    correctAnswer: "C",
    explanation:
      "A valuation allowance is recorded to reduce the DTA to the amount that is more likely than not to be realized. The DTA is $50,000 and management expects only $30,000 to be realized. Therefore, the valuation allowance = $50,000 - $30,000 = $20,000. The question asks for the valuation allowance before considering the tax rate change, so the rate change does not affect this calculation. The net DTA reported on the balance sheet would be $50,000 - $20,000 = $30,000.",
    explanationJa:
      "評価性引当金は、DTAを実現可能性が高い金額まで減額するために計上されます。DTAは$50,000で、経営陣は$30,000のみ実現すると見込んでいます。したがって、評価性引当金 = $50,000 - $30,000 = $20,000です。問題は税率変更前の評価性引当金を問うているため、税率変更はこの計算に影響しません。貸借対照表に報告されるDTAの純額は$50,000 - $20,000 = $30,000となります。",
    difficulty: 3,
  },
];
