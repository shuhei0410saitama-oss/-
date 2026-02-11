export interface TopicContent {
  summary: string;
  keyPoints: string[];
  examTips: string[];
  relatedTopics: string[];
}

export interface Topic {
  id: number;
  slug: string;
  title: string;
  titleJa: string;
  category: string;
  categoryJa: string;
  difficulty: 1 | 2 | 3;
  description: string;
  descriptionJa: string;
  themeColor: string;
  content: TopicContent;
}

export interface TopicCategory {
  id: string;
  name: string;
  nameJa: string;
}

export const topics: Topic[] = [
  {
    id: 1,
    slug: "revenue-recognition",
    title: "Revenue Recognition (ASC 606)",
    titleJa: "収益認識（ASC 606）",
    category: "revenue-recognition",
    categoryJa: "収益認識",
    difficulty: 3,
    description:
      "Comprehensive study of the five-step revenue recognition model under ASC 606, including identifying performance obligations, determining transaction price, and allocating revenue.",
    descriptionJa:
      "ASC 606に基づく5ステップの収益認識モデルについて、履行義務の識別、取引価格の決定、収益の配分を包括的に学習します。",
    themeColor: "#818cf8",
    content: {
      summary:
        "ASC 606は、顧客との契約から生じる収益を認識するための5ステップモデルを規定しています。このモデルでは、契約の識別、履行義務の識別、取引価格の決定、取引価格の配分、および収益の認識という5つのステップを順に適用します。企業は履行義務を充足した時点、または充足するにつれて収益を認識しなければなりません。",
      keyPoints: [
        "5ステップモデル：①契約の識別 ②履行義務の識別 ③取引価格の決定 ④取引価格の配分 ⑤収益の認識",
        "履行義務は「一定の期間にわたり充足される」か「一時点で充足される」かを判断する必要がある",
        "変動対価（リベート、割引、ペナルティなど）は期待値法または最頻値法で見積もる",
        "複数の履行義務がある場合、独立販売価格に基づいて取引価格を配分する",
        "契約変更は、別個の契約として処理するか、既存契約の修正として処理するかを判断する",
      ],
      examTips: [
        "5ステップの順序と各ステップの具体的な適用要件を正確に暗記すること",
        "一定期間にわたる収益認識の3つの要件（代替用途がない資産＋支払請求権など）を区別できるようにする",
        "契約コスト（取得コストと履行コスト）の資産計上要件も出題頻度が高い",
      ],
      relatedTopics: [
        "lease-accounting",
        "cash-flow-statement",
      ],
    },
  },
  {
    id: 2,
    slug: "inventory",
    title: "Inventory (LIFO/FIFO/Weighted Average)",
    titleJa: "棚卸資産（LIFO/FIFO/加重平均法）",
    category: "assets",
    categoryJa: "資産",
    difficulty: 2,
    description:
      "Study of inventory valuation methods including LIFO, FIFO, and weighted average cost, along with lower of cost or net realizable value (LCNRV) adjustments.",
    descriptionJa:
      "LIFO、FIFO、加重平均法を含む棚卸資産の評価方法と、低価法（原価と正味実現可能価額の低い方）による評価替えを学習します。",
    themeColor: "#f472b6",
    content: {
      summary:
        "棚卸資産は取得原価で計上し、FIFO（先入先出法）、LIFO（後入先出法）、加重平均法のいずれかで原価配分を行います。US GAAPでは、棚卸資産は原価と正味実現可能価額（NRV）の低い方で評価しますが、LIFO採用企業は原価と市場価額の低い方で評価します。各評価方法が財務諸表に与える影響を理解することが重要です。",
      keyPoints: [
        "FIFO：最も古い在庫から先に払い出すと仮定し、期末在庫は最新の原価で評価される",
        "LIFO：最も新しい在庫から先に払い出すと仮定し、インフレ時には課税所得を低く抑える効果がある",
        "加重平均法：期中の全仕入原価を加重平均して単価を算出する方法である",
        "LCNRV（Lower of Cost or NRV）：棚卸資産の簿価がNRVを超える場合、NRVまで切り下げる",
        "LIFO清算（LIFO Liquidation）：古い低コスト層が払い出されると利益が膨張する現象に注意",
      ],
      examTips: [
        "各方法による売上原価・期末在庫・売上総利益への影響をインフレ・デフレ両方のケースで理解する",
        "LIFO適合要件（LIFO Conformity Rule）：税務上LIFOを使う場合、財務報告上もLIFOを使用しなければならない",
        "永続棚卸法と実地棚卸法の違いと、それぞれにおける加重平均法の計算方法の違いに注意",
      ],
      relatedTopics: [
        "cash-flow-statement",
        "deferred-tax",
      ],
    },
  },
  {
    id: 3,
    slug: "bonds-payable",
    title: "Bonds Payable",
    titleJa: "社債（支払債券）",
    category: "liabilities",
    categoryJa: "負債",
    difficulty: 2,
    description:
      "Study of bond issuance, amortization of premiums and discounts using effective interest and straight-line methods, and bond retirement accounting.",
    descriptionJa:
      "社債の発行、実効金利法および定額法によるプレミアムとディスカウントの償却、社債の償還に関する会計処理を学習します。",
    themeColor: "#34d399",
    content: {
      summary:
        "社債は額面金額、表面利率、市場金利の関係によりプレミアム（割増）またはディスカウント（割引）で発行されます。社債の帳簿価額は実効金利法（または定額法）により満期日に向けて額面金額に収束するよう調整されます。社債の期中償還では、帳簿価額と償還価額の差額が償還損益として認識されます。",
      keyPoints: [
        "表面利率 > 市場金利 → プレミアム発行（発行価額 > 額面）、表面利率 < 市場金利 → ディスカウント発行",
        "実効金利法：利息費用 = 期首帳簿価額 × 市場金利、償却額 = 利息費用 − クーポン支払額",
        "プレミアムの償却では利息費用がクーポン支払額より少なくなり、帳簿価額は毎期減少する",
        "ディスカウントの償却では利息費用がクーポン支払額より多くなり、帳簿価額は毎期増加する",
        "社債発行費は社債のディスカウントに加算して処理し、実効金利に反映させる",
      ],
      examTips: [
        "実効金利法による償却スケジュールの各期の利息費用・償却額・帳簿価額を正確に計算できるようにする",
        "期中発行の場合、前回利払日からの経過利息（accrued interest）を購入者が支払う点に注意",
        "期中償還時の帳簿価額の算出と償還損益の計算が頻出テーマである",
      ],
      relatedTopics: [
        "cash-flow-statement",
        "deferred-tax",
      ],
    },
  },
  {
    id: 4,
    slug: "lease-accounting",
    title: "Lease Accounting (ASC 842)",
    titleJa: "リース会計（ASC 842）",
    category: "leases",
    categoryJa: "リース",
    difficulty: 3,
    description:
      "Study of lessee and lessor accounting under ASC 842, including classification of finance and operating leases, right-of-use asset and lease liability measurement.",
    descriptionJa:
      "ASC 842に基づく借手・貸手のリース会計処理、ファイナンスリースとオペレーティングリースの分類、使用権資産とリース負債の測定を学習します。",
    themeColor: "#fbbf24",
    content: {
      summary:
        "ASC 842では、借手はほぼすべてのリースについて使用権資産（ROU資産）とリース負債を貸借対照表に計上します。リースはファイナンスリースとオペレーティングリースに分類され、費用認識パターンが異なります。貸手の会計処理は販売型リース、直接金融型リース、オペレーティングリースの3つに分類されます。",
      keyPoints: [
        "借手はすべてのリース（短期リースの免除適用を除く）についてROU資産とリース負債をBS計上する",
        "ファイナンスリースの5つの分類基準：①所有権移転 ②割安購入選択権 ③リース期間が経済的耐用年数の大部分 ④現在価値が公正価値のほぼ全部 ⑤特殊資産",
        "借手のファイナンスリースは償却費と利息費用を別々に認識し、オペレーティングリースは単一のリース費用を定額で認識する",
        "リース負債の測定には、リース料の現在価値を算出するために貸手の計算利子率（既知の場合）または追加借入利子率を使用する",
        "リースの変更（修正）は、別個の契約か既存リースの修正かを判断し、再測定を行う",
      ],
      examTips: [
        "ファイナンスリースとオペレーティングリースの借手側の仕訳の違い（特に費用認識パターン）を確実に理解する",
        "リース負債とROU資産の当初測定の計算（リース料の現在価値＋初期直接費用等）を正確に行えるようにする",
        "貸手の3分類（販売型・直接金融型・オペレーティング）の判定基準と収益認識の違いも出題される",
      ],
      relatedTopics: [
        "revenue-recognition",
        "cash-flow-statement",
        "deferred-tax",
      ],
    },
  },
  {
    id: 5,
    slug: "cash-flow-statement",
    title: "Cash Flow Statement",
    titleJa: "キャッシュ・フロー計算書",
    category: "financial-statements",
    categoryJa: "財務諸表",
    difficulty: 2,
    description:
      "Study of the statement of cash flows, including classification of activities, direct and indirect methods, and common adjustments for non-cash items.",
    descriptionJa:
      "キャッシュ・フロー計算書の作成方法、活動区分の分類、直接法と間接法、非現金項目の調整について学習します。",
    themeColor: "#38bdf8",
    content: {
      summary:
        "キャッシュ・フロー計算書は営業活動、投資活動、財務活動の3区分で現金の増減を報告します。営業活動には直接法と間接法があり、間接法では当期純利益から非現金項目や運転資本の変動を調整して営業キャッシュ・フローを算出します。US GAAPでは利息の支払いと受取は営業活動に分類される点がIFRSとの主な相違点です。",
      keyPoints: [
        "営業活動（間接法）：当期純利益 ± 非現金項目（減価償却費、のれん減損等）± 運転資本の増減で算出",
        "投資活動：固定資産・有価証券の取得や売却、貸付金の実行や回収が含まれる",
        "財務活動：株式の発行・自己株式の取得、借入金の調達・返済、配当金の支払いが含まれる",
        "US GAAPでは、利息の支払・受取および配当の受取は営業活動、配当の支払は財務活動に分類される",
        "重要な非現金取引（資産のリース取得、転換社債の株式転換等）は注記で開示する",
      ],
      examTips: [
        "間接法における各調整項目の加減の方向を正確に覚える（減価償却費は加算、売却益は減算など）",
        "各取引がどの活動区分に分類されるかを即座に判断できるようにする（特に利息・配当の分類）",
        "フリーキャッシュフロー（営業CF − 資本的支出）の計算も問われることがある",
      ],
      relatedTopics: [
        "revenue-recognition",
        "inventory",
        "bonds-payable",
        "lease-accounting",
      ],
    },
  },
  {
    id: 6,
    slug: "deferred-tax",
    title: "Deferred Tax Assets/Liabilities",
    titleJa: "繰延税金資産・負債",
    category: "tax-effect",
    categoryJa: "税効果",
    difficulty: 3,
    description:
      "Study of deferred tax accounting, including temporary differences, deferred tax asset valuation allowances, and tax rate change effects.",
    descriptionJa:
      "繰延税金の会計処理、一時差異の概念、繰延税金資産の評価性引当金、税率変更の影響について学習します。",
    themeColor: "#fb923c",
    content: {
      summary:
        "繰延税金は、会計上の資産・負債の帳簿価額と税務上の簿価との一時差異から生じます。将来減算一時差異（帳簿価額 < 税務簿価の資産、または帳簿価額 > 税務簿価の負債）は繰延税金資産を、将来加算一時差異は繰延税金負債を生じさせます。繰延税金資産は、実現可能性が50%超でない部分について評価性引当金を設定します。",
      keyPoints: [
        "一時差異：会計上と税務上の資産・負債の帳簿価額の差異で、将来の課税所得に影響を与えるもの",
        "繰延税金資産（DTA）：将来減算一時差異から発生し、将来の税金を減少させる効果がある",
        "繰延税金負債（DTL）：将来加算一時差異から発生し、将来の税金を増加させる効果がある",
        "評価性引当金（Valuation Allowance）：DTAの実現可能性がmore likely than not（50%超）でない場合に設定する",
        "繰延税金は制定済み税率（enacted tax rate）で計算し、税率変更時には既存の繰延税金残高を再計算する",
      ],
      examTips: [
        "一時差異と永久差異（交際費、罰金、非課税利息等）の区別を正確にできるようにする",
        "実効税率と法定税率の調整表（rate reconciliation）の作成方法を理解する",
        "DTAとDTLの相殺表示ルール（同一税務管轄区域内でのみ相殺可能）を覚えておく",
      ],
      relatedTopics: [
        "inventory",
        "bonds-payable",
        "lease-accounting",
      ],
    },
  },
];

export const topicCategories: TopicCategory[] = [
  {
    id: "revenue-recognition",
    name: "Revenue Recognition",
    nameJa: "収益認識",
  },
  {
    id: "assets",
    name: "Assets",
    nameJa: "資産",
  },
  {
    id: "liabilities",
    name: "Liabilities",
    nameJa: "負債",
  },
  {
    id: "leases",
    name: "Leases",
    nameJa: "リース",
  },
  {
    id: "financial-statements",
    name: "Financial Statements",
    nameJa: "財務諸表",
  },
  {
    id: "tax-effect",
    name: "Tax Effect Accounting",
    nameJa: "税効果",
  },
];
