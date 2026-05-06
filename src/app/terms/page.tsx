import { Shield, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <Link href="/" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
        <ChevronLeft className="w-3.5 h-3.5" /> トップに戻る
      </Link>

      <div className="flex items-center gap-2">
        <Shield className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-black">利用規約・プライバシーポリシー</h1>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5 space-y-6 text-sm">
        <section>
          <h2 className="font-bold text-base mb-3 text-primary">利用規約</h2>
          <p className="text-xs text-muted-foreground mb-4">最終更新日: 2025年4月29日</p>

          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-sm mb-1">第1条（目的）</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                本規約は、アイドルSNS（以下「本サービス」）を利用するすべてのユーザーに適用されます。本サービスは、地下アイドル・ライブアイドル・メンズアイドルに関する情報を収集・共有し、ファン同士が交流できるコミュニティを提供することを目的とします。
              </p>
            </div>

            <div>
              <h3 className="font-bold text-sm mb-1">第2条（禁止事項）</h3>
              <p className="text-xs text-muted-foreground mb-1">以下の行為を禁止します。違反した場合、投稿削除・アカウント停止等の措置を取ることがあります。</p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                <li><strong className="text-foreground">誹謗中傷・差別的発言</strong>：アイドルメンバー・他ユーザーへの人格攻撃、差別的表現</li>
                <li><strong className="text-foreground">個人情報の晒し</strong>：本名・住所・電話番号・家族情報などプライバシーに関わる情報の無断公開</li>
                <li><strong className="text-foreground">憶測・デマの拡散</strong>：根拠のない噂、恋愛・スキャンダルに関する憶測投稿</li>
                <li><strong className="text-foreground">スパム・宣伝行為</strong>：無関係な商品・サービスの宣伝、同一内容の連続投稿</li>
                <li><strong className="text-foreground">著作権侵害</strong>：無断での画像・動画・音楽の転載</li>
                <li><strong className="text-foreground">なりすまし</strong>：アイドル本人・スタッフを装った投稿</li>
                <li><strong className="text-foreground">未成年者への不適切なアプローチ</strong></li>
                <li><strong className="text-foreground">その他、公序良俗に反する行為</strong></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-sm mb-1">第3条（投稿内容について）</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                ユーザーが投稿したコンテンツの著作権はユーザーに帰属しますが、本サービスの運営・改善・プロモーションに必要な範囲で利用する権利をユーザーに許諾いただきます。不適切な投稿は管理者が削除することがあります。
              </p>
            </div>

            <div>
              <h3 className="font-bold text-sm mb-1">第4条（通報機能）</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                利用規約に違反する投稿を発見した場合、通報ボタンから報告してください。管理者が内容を確認し、適切な措置を取ります。悪意ある虚偽通報は制裁の対象となります。
              </p>
            </div>

            <div>
              <h3 className="font-bold text-sm mb-1">第5条（免責事項）</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                本サービスは情報の正確性を保証しません。ユーザー投稿に含まれる情報の真偽については、ユーザー自身で判断してください。本サービスの利用によって生じた損害について、運営は責任を負いません。
              </p>
            </div>
          </div>
        </section>

        <hr className="border-border" />

        <section id="privacy">
          <h2 className="font-bold text-base mb-3 text-primary">プライバシーポリシー</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-sm mb-1">収集する情報</h3>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                <li>メールアドレス・ニックネーム（登録時）</li>
                <li>投稿内容・いいね・通報履歴</li>
                <li>アクセスログ（IPアドレス、閲覧ページ等）</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-sm mb-1">情報の利用目的</h3>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                <li>本サービスの提供・運営・改善</li>
                <li>不正利用の防止・対応</li>
                <li>重要なお知らせの送信</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-sm mb-1">第三者提供</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                法令に基づく場合を除き、ユーザーの同意なく第三者に個人情報を提供しません。本サービスはSupabase（データベース）、Vercel（ホスティング）を利用しています。
              </p>
            </div>

            <div>
              <h3 className="font-bold text-sm mb-1">Cookie・アクセス解析</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                本サービスはCookieを使用し、認証状態の維持・利便性向上に利用します。ブラウザ設定でCookieを無効にできますが、一部機能が利用できなくなる場合があります。
              </p>
            </div>
          </div>
        </section>

        <div className="bg-muted/50 rounded-xl p-3">
          <p className="text-xs text-muted-foreground">
            ご不明な点は運営までお問い合わせください。本規約は予告なく変更される場合があります。変更後も継続して本サービスを利用した場合、変更後の規約に同意したものとみなします。
          </p>
        </div>
      </div>
    </div>
  )
}
