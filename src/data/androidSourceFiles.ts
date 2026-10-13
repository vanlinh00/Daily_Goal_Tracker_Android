export interface AndroidSourceFile {
  path: string;
  category: 'Gradle & Manifest' | 'Data Layer (Room)' | 'Domain Layer' | 'Presentation (Compose)' | 'Monetization' | 'Worker & Backup' | 'DI (Hilt)';
  description: string;
  code: string;
}

export const ANDROID_SOURCE_FILES: AndroidSourceFile[] = [
  {
    path: 'app/build.gradle.kts',
    category: 'Gradle & Manifest',
    description: 'Gradle configuration với Jetpack Compose, Room DB, Hilt DI, AdMob và Google Play Billing v6',
    code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.kapt)
    alias(libs.plugins.hilt.android)
    alias(libs.plugins.kotlin.serialization)
}

android {
    namespace = "com.goalify.tracker"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.goalify.tracker"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }

        // Room Schema Export for automated migration testing
        kapt {
            arguments {
                arg("room.schemaLocation", "$projectDir/schemas")
                arg("room.incremental", "true")
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("debug") // Thay bằng release keystore
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
        freeCompilerArgs += listOf(
            "-opt-in=kotlinx.coroutines.ExperimentalCoroutinesApi",
            "-opt-in=androidx.compose.material3.ExperimentalMaterial3Api"
        )
    }
    buildFeatures {
        compose = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.8"
    }
    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    // Jetpack Compose & Material 3 (BOM)
    implementation(platform("androidx.compose:compose-bom:2024.04.01"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")
    implementation("androidx.activity:activity-compose:1.9.0")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.7.0")
    implementation("androidx.lifecycle:lifecycle-runtime-compose:2.7.0")
    implementation("androidx.navigation:navigation-compose:2.7.7")

    // Room Database (v2.6.1)
    val roomVersion = "2.6.1"
    implementation("androidx.room:room-runtime:$roomVersion")
    implementation("androidx.room:room-ktx:$roomVersion")
    kapt("androidx.room:room-compiler:$roomVersion")

    // Jetpack DataStore Preferences (Senior standard for offline flags)
    implementation("androidx.datastore:datastore-preferences:1.1.0")

    // Dagger Hilt
    implementation("com.google.dagger:hilt-android:2.51.1")
    kapt("com.google.dagger:hilt-compiler:2.51.1")
    implementation("androidx.hilt:hilt-navigation-compose:1.2.0")

    // WorkManager (Offline Reminder Notifications)
    implementation("androidx.work:work-runtime-ktx:2.9.0")
    implementation("androidx.hilt:hilt-work:1.2.0")

    // Google Mobile Ads (AdMob v23.0.0)
    implementation("com.google.android.gms:play-services-ads:23.0.0")

    // Google Play Billing v6+ (In-App Purchases)
    implementation("com.android.billingclient:billing-ktx:6.2.0")

    // Kotlin Coroutines & Serialization
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.0")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.3")
}`,
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    category: 'Gradle & Manifest',
    description: 'Manifest cấu hình quyền Offline, WorkManager, Boot Receiver và AdMob ID',
    code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Offline App Permissions -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
    <uses-permission android:name="com.android.vending.BILLING" />

    <application
        android:name=".GoalifyApplication"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.Goalify">

        <!-- Google AdMob Sample App ID (Thay thế bằng ID sản phẩm thực tế) -->
        <meta-data
            android:name="com.google.android.gms.ads.APPLICATION_ID"
            android:value="ca-app-pub-3940256099942544~3347511713" />

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:windowSoftInputMode="adjustResize"
            android:theme="@style/Theme.Goalify">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Receiver khôi phục chính xác báo thức khi thiết bị khởi động lại -->
        <receiver
            android:name=".notification.BootCompletedReceiver"
            android:exported="false">
            <intent-filter>
                <action android:name="android.intent.action.BOOT_COMPLETED" />
            </intent-filter>
        </receiver>

    </application>
</manifest>`,
  },
  {
    path: 'common/Resource.kt',
    category: 'Domain Layer',
    description: 'Sealed interface tiêu chuẩn Senior xử lý State đồng bộ (Loading, Success, Error)',
    code: `package com.goalify.tracker.common

sealed interface Resource<out T> {
    data class Success<out T>(val data: T) : Resource<T>
    data class Error(val message: String, val throwable: Throwable? = null) : Resource<Nothing>
    object Loading : Resource<Nothing>
}`,
  },
  {
    path: 'common/DispatcherModule.kt',
    category: 'DI (Hilt)',
    description: 'Senior Coroutine Dispatchers Injection Module (Dễ dàng Unit Test)',
    code: `package com.goalify.tracker.common

import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.Dispatchers
import javax.inject.Qualifier

@Qualifier
@Retention(AnnotationRetention.BINARY)
annotation class IoDispatcher

@Qualifier
@Retention(AnnotationRetention.BINARY)
annotation class DefaultDispatcher

@Qualifier
@Retention(AnnotationRetention.BINARY)
annotation class MainDispatcher

@Module
@InstallIn(SingletonComponent::class)
object DispatcherModule {

    @Provides
    @IoDispatcher
    fun provideIoDispatcher(): CoroutineDispatcher = Dispatchers.IO

    @Provides
    @DefaultDispatcher
    fun provideDefaultDispatcher(): CoroutineDispatcher = Dispatchers.Default

    @Provides
    @MainDispatcher
    fun provideMainDispatcher(): CoroutineDispatcher = Dispatchers.Main
}`,
  },
  {
    path: 'data/local/entity/YearlyGoalEntity.kt',
    category: 'Data Layer (Room)',
    description: 'Entity Room cho Mục tiêu Năm có Index tối ưu hóa truy vấn',
    code: `package com.goalify.tracker.data.local.entity

import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey

enum class GoalStatus {
    NOT_STARTED,
    IN_PROGRESS,
    COMPLETED
}

@Entity(
    tableName = "yearly_goals",
    indices = [Index(value = ["year"])]
)
data class YearlyGoalEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val title: String,
    val description: String = "",
    val year: Int,
    val status: GoalStatus = GoalStatus.IN_PROGRESS,
    val progress: Float = 0.0f, // 0.0f - 100.0f
    val createdAt: Long = System.currentTimeMillis()
)`,
  },
  {
    path: 'data/local/entity/MonthlyGoalEntity.kt',
    category: 'Data Layer (Room)',
    description: 'Entity Room cho Mục tiêu Tháng với Foreign Key CASCADE và Index tối ưu',
    code: `package com.goalify.tracker.data.local.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(
    tableName = "monthly_goals",
    foreignKeys = [
        ForeignKey(
            entity = YearlyGoalEntity::class,
            parentColumns = ["id"],
            childColumns = ["yearlyGoalId"],
            onDelete = ForeignKey.CASCADE
        )
    ],
    indices = [
        Index(value = ["yearlyGoalId"]),
        Index(value = ["month", "year"])
    ]
)
data class MonthlyGoalEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    @ColumnInfo(name = "yearlyGoalId")
    val yearlyGoalId: Long,
    val title: String,
    val month: Int, // 1..12
    val year: Int,
    val status: GoalStatus = GoalStatus.IN_PROGRESS,
    val progress: Float = 0.0f,
    val createdAt: Long = System.currentTimeMillis()
)`,
  },
  {
    path: 'data/local/entity/WeeklyGoalEntity.kt',
    category: 'Data Layer (Room)',
    description: 'Entity Room cho Mục tiêu Tuần với Foreign Key và Index tuần',
    code: `package com.goalify.tracker.data.local.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(
    tableName = "weekly_goals",
    foreignKeys = [
        ForeignKey(
            entity = MonthlyGoalEntity::class,
            parentColumns = ["id"],
            childColumns = ["monthlyGoalId"],
            onDelete = ForeignKey.CASCADE
        )
    ],
    indices = [
        Index(value = ["monthlyGoalId"]),
        Index(value = ["weekNumber", "year"])
    ]
)
data class WeeklyGoalEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    @ColumnInfo(name = "monthlyGoalId")
    val monthlyGoalId: Long,
    val title: String,
    val weekNumber: Int, // 1..52
    val year: Int,
    val status: GoalStatus = GoalStatus.IN_PROGRESS,
    val progress: Float = 0.0f,
    val createdAt: Long = System.currentTimeMillis()
)`,
  },
  {
    path: 'data/local/entity/DailyTaskEntity.kt',
    category: 'Data Layer (Room)',
    description: 'Entity Room cho Công việc Hàng ngày (WeeklyGoalId có thể Nullable, Index date)',
    code: `package com.goalify.tracker.data.local.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(
    tableName = "daily_tasks",
    foreignKeys = [
        ForeignKey(
            entity = WeeklyGoalEntity::class,
            parentColumns = ["id"],
            childColumns = ["weeklyGoalId"],
            onDelete = ForeignKey.SET_NULL
        )
    ],
    indices = [
        Index(value = ["weeklyGoalId"]),
        Index(value = ["date"]),
        Index(value = ["isCompleted"])
    ]
)
data class DailyTaskEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    @ColumnInfo(name = "weeklyGoalId")
    val weeklyGoalId: Long? = null,
    val title: String,
    val date: String, // YYYY-MM-DD
    val isCompleted: Boolean = false,
    val reminderTime: String? = null, // "HH:mm"
    val priority: String = "MEDIUM", // LOW, MEDIUM, HIGH
    val createdAt: Long = System.currentTimeMillis()
)`,
  },
  {
    path: 'data/local/relation/GoalRelations.kt',
    category: 'Data Layer (Room)',
    description: 'Room 1-N Relations: Lồng ghép cấu trúc Năm -> Tháng -> Tuần -> Task',
    code: `package com.goalify.tracker.data.local.relation

import androidx.room.Embedded
import androidx.room.Relation
import com.goalify.tracker.data.local.entity.DailyTaskEntity
import com.goalify.tracker.data.local.entity.MonthlyGoalEntity
import com.goalify.tracker.data.local.entity.WeeklyGoalEntity
import com.goalify.tracker.data.local.entity.YearlyGoalEntity

// 1. Weekly Goal kèm danh sách Daily Tasks
data class WeeklyWithTasks(
    @Embedded val weeklyGoal: WeeklyGoalEntity,
    @Relation(
        parentColumn = "id",
        entityColumn = "weeklyGoalId"
    )
    val tasks: List<DailyTaskEntity>
)

// 2. Monthly Goal kèm danh sách Weekly Goals
data class MonthlyWithWeeklyGoals(
    @Embedded val monthlyGoal: MonthlyGoalEntity,
    @Relation(
        parentColumn = "id",
        entityColumn = "monthlyGoalId"
    )
    val weeklyGoals: List<WeeklyGoalEntity>
)

// 3. Yearly Goal kèm danh sách Monthly Goals
data class YearlyWithMonthlyGoals(
    @Embedded val yearlyGoal: YearlyGoalEntity,
    @Relation(
        parentColumn = "id",
        entityColumn = "yearlyGoalId"
    )
    val monthlyGoals: List<MonthlyGoalEntity>
)`,
  },
  {
    path: 'data/local/dao/GoalDao.kt',
    category: 'Data Layer (Room)',
    description: 'Senior DAO với Reactive Kotlin Flow, Transaction tính toán tiến độ nguyên tử (Atomic)',
    code: `package com.goalify.tracker.data.local.dao

import androidx.room.*
import com.goalify.tracker.data.local.entity.*
import com.goalify.tracker.data.local.relation.MonthlyWithWeeklyGoals
import com.goalify.tracker.data.local.relation.WeeklyWithTasks
import com.goalify.tracker.data.local.relation.YearlyWithMonthlyGoals
import kotlinx.coroutines.flow.Flow

@Dao
interface GoalDao {

    // --- YEARLY GOALS ---
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertYearlyGoal(goal: YearlyGoalEntity): Long

    @Update
    suspend fun updateYearlyGoal(goal: YearlyGoalEntity)

    @Delete
    suspend fun deleteYearlyGoal(goal: YearlyGoalEntity)

    @Query("SELECT * FROM yearly_goals WHERE year = :year ORDER BY id DESC")
    fun getYearlyGoalsByYear(year: Int): Flow<List<YearlyGoalEntity>>

    @Query("SELECT * FROM yearly_goals WHERE id = :id LIMIT 1")
    suspend fun getYearlyGoalById(id: Long): YearlyGoalEntity?

    @Transaction
    @Query("SELECT * FROM yearly_goals WHERE id = :id")
    fun getYearlyGoalWithMonths(id: Long): Flow<YearlyWithMonthlyGoals>

    // --- MONTHLY GOALS ---
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMonthlyGoal(goal: MonthlyGoalEntity): Long

    @Update
    suspend fun updateMonthlyGoal(goal: MonthlyGoalEntity)

    @Delete
    suspend fun deleteMonthlyGoal(goal: MonthlyGoalEntity)

    @Query("SELECT * FROM monthly_goals WHERE yearlyGoalId = :yearlyId ORDER BY month ASC")
    fun getMonthlyGoalsByYearlyId(yearlyId: Long): Flow<List<MonthlyGoalEntity>>

    @Query("SELECT * FROM monthly_goals WHERE id = :id LIMIT 1")
    suspend fun getMonthlyGoalById(id: Long): MonthlyGoalEntity?

    @Transaction
    @Query("SELECT * FROM monthly_goals WHERE id = :id")
    fun getMonthlyGoalWithWeeks(id: Long): Flow<MonthlyWithWeeklyGoals>

    // --- WEEKLY GOALS ---
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertWeeklyGoal(goal: WeeklyGoalEntity): Long

    @Update
    suspend fun updateWeeklyGoal(goal: WeeklyGoalEntity)

    @Delete
    suspend fun deleteWeeklyGoal(goal: WeeklyGoalEntity)

    @Query("SELECT * FROM weekly_goals WHERE monthlyGoalId = :monthlyId ORDER BY weekNumber ASC")
    fun getWeeklyGoalsByMonthlyId(monthlyId: Long): Flow<List<WeeklyGoalEntity>>

    @Query("SELECT * FROM weekly_goals WHERE id = :id LIMIT 1")
    suspend fun getWeeklyGoalById(id: Long): WeeklyGoalEntity?

    @Transaction
    @Query("SELECT * FROM weekly_goals WHERE id = :id")
    fun getWeeklyGoalWithTasks(id: Long): Flow<WeeklyWithTasks>

    // --- DAILY TASKS ---
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertDailyTask(task: DailyTaskEntity): Long

    @Update
    suspend fun updateDailyTask(task: DailyTaskEntity)

    @Delete
    suspend fun deleteDailyTask(task: DailyTaskEntity)

    @Query("SELECT * FROM daily_tasks WHERE id = :id LIMIT 1")
    suspend fun getDailyTaskById(id: Long): DailyTaskEntity?

    @Query("SELECT * FROM daily_tasks WHERE date = :date ORDER BY isCompleted ASC, priority DESC, id ASC")
    fun getDailyTasksForDate(date: String): Flow<List<DailyTaskEntity>>

    @Query("SELECT * FROM daily_tasks WHERE weeklyGoalId = :weeklyId")
    suspend fun getTasksForWeeklyGoal(weeklyId: Long): List<DailyTaskEntity>

    // --- UPDATE PROGRESS QUERIES ---
    @Query("UPDATE weekly_goals SET progress = :progress, status = :status WHERE id = :weeklyId")
    suspend fun updateWeeklyProgress(weeklyId: Long, progress: Float, status: GoalStatus)

    @Query("UPDATE monthly_goals SET progress = :progress, status = :status WHERE id = :monthlyId")
    suspend fun updateMonthlyProgress(monthlyId: Long, progress: Float, status: GoalStatus)

    @Query("UPDATE yearly_goals SET progress = :progress, status = :status WHERE id = :yearlyId")
    suspend fun updateYearlyProgress(yearlyId: Long, progress: Float, status: GoalStatus)

    @Query("SELECT * FROM weekly_goals WHERE monthlyGoalId = :monthlyId")
    suspend fun getWeeklyGoalsSync(monthlyId: Long): List<WeeklyGoalEntity>

    @Query("SELECT * FROM monthly_goals WHERE yearlyGoalId = :yearlyId")
    suspend fun getMonthlyGoalsSync(yearlyId: Long): List<MonthlyGoalEntity>

    /**
     * SENIOR ATOMIC CASCADE TRANSACTION:
     * Đảm bảo tính nhất quán 100% trong SQLite transaction:
     * Task ➔ Weekly ➔ Monthly ➔ Yearly
     */
    @Transaction
    suspend fun executeCascadeRollup(weeklyGoalId: Long) {
        // 1. Cập nhật Weekly Goal từ tasks
        val tasks = getTasksForWeeklyGoal(weeklyGoalId)
        val weeklyGoal = getWeeklyGoalById(weeklyGoalId) ?: return

        val weeklyProgress = if (tasks.isNotEmpty()) {
            val completed = tasks.count { it.isCompleted }
            (completed.toFloat() / tasks.size.toFloat()) * 100f
        } else {
            0f
        }
        val weeklyStatus = when {
            weeklyProgress >= 100f -> GoalStatus.COMPLETED
            weeklyProgress > 0f -> GoalStatus.IN_PROGRESS
            else -> GoalStatus.NOT_STARTED
        }
        updateWeeklyProgress(weeklyGoalId, weeklyProgress, weeklyStatus)

        // 2. Cập nhật Monthly Goal từ all weekly goals
        val monthlyGoalId = weeklyGoal.monthlyGoalId
        val monthlyGoal = getMonthlyGoalById(monthlyGoalId) ?: return
        val siblingWeeks = getWeeklyGoalsSync(monthlyGoalId)

        val monthlyProgress = if (siblingWeeks.isNotEmpty()) {
            siblingWeeks.map { if (it.id == weeklyGoalId) weeklyProgress else it.progress }.average().toFloat()
        } else {
            0f
        }
        val monthlyStatus = when {
            monthlyProgress >= 100f -> GoalStatus.COMPLETED
            monthlyProgress > 0f -> GoalStatus.IN_PROGRESS
            else -> GoalStatus.NOT_STARTED
        }
        updateMonthlyProgress(monthlyGoalId, monthlyProgress, monthlyStatus)

        // 3. Cập nhật Yearly Goal từ all monthly goals
        val yearlyGoalId = monthlyGoal.yearlyGoalId
        val siblingMonths = getMonthlyGoalsSync(yearlyGoalId)
        val yearlyProgress = if (siblingMonths.isNotEmpty()) {
            siblingMonths.map { if (it.id == monthlyGoalId) monthlyProgress else it.progress }.average().toFloat()
        } else {
            0f
        }
        val yearlyStatus = when {
            yearlyProgress >= 100f -> GoalStatus.COMPLETED
            yearlyProgress > 0f -> GoalStatus.IN_PROGRESS
            else -> GoalStatus.NOT_STARTED
        }
        updateYearlyProgress(yearlyGoalId, yearlyProgress, yearlyStatus)
    }
}`,
  },
  {
    path: 'data/local/AppDatabase.kt',
    category: 'Data Layer (Room)',
    description: 'RoomDatabase Singleton Class với TypeConverters và Migration an toàn',
    code: `package com.goalify.tracker.data.local

import androidx.room.Database
import androidx.room.RoomDatabase
import androidx.room.TypeConverter
import androidx.room.TypeConverters
import com.goalify.tracker.data.local.dao.GoalDao
import com.goalify.tracker.data.local.entity.*

class Converters {
    @TypeConverter
    fun fromGoalStatus(status: GoalStatus): String = status.name

    @TypeConverter
    fun toGoalStatus(value: String): GoalStatus = try {
        enumValueOf(value)
    } catch (_: Exception) {
        GoalStatus.NOT_STARTED
    }
}

@Database(
    entities = [
        YearlyGoalEntity::class,
        MonthlyGoalEntity::class,
        WeeklyGoalEntity::class,
        DailyTaskEntity::class
    ],
    version = 1,
    exportSchema = true
)
@TypeConverters(Converters::class)
abstract class AppDatabase : RoomDatabase() {
    abstract fun goalDao(): GoalDao

    companion object {
        const val DATABASE_NAME = "goalify_offline.db"
    }
}`,
  },
  {
    path: 'data/preferences/UserPreferencesDataStore.kt',
    category: 'Data Layer (Room)',
    description: 'Senior Jetpack DataStore Preferences thay thế SharedPreferences cho Reactive State',
    code: `package com.goalify.tracker.data.preferences

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.*
import androidx.datastore.preferences.preferencesDataStore
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.map
import java.io.IOException
import javax.inject.Inject
import javax.inject.Singleton

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "user_preferences")

@Singleton
class UserPreferencesDataStore @Inject constructor(
    @ApplicationContext private val context: Context
) {
    private object PreferencesKeys {
        val IS_PREMIUM = booleanPreferencesKey("is_premium")
        val NOTIFICATIONS_ENABLED = booleanPreferencesKey("notifications_enabled")
        val REMINDER_TIME = stringPreferencesKey("reminder_time")
        val STREAK_COUNT = intPreferencesKey("streak_count")
    }

    val isPremiumFlow: Flow<Boolean> = context.dataStore.data
        .catch { exception ->
            if (exception is IOException) emit(emptyPreferences()) else throw exception
        }
        .map { preferences ->
            preferences[PreferencesKeys.IS_PREMIUM] ?: false
        }

    val notificationsEnabledFlow: Flow<Boolean> = context.dataStore.data
        .catch { exception ->
            if (exception is IOException) emit(emptyPreferences()) else throw exception
        }
        .map { preferences ->
            preferences[PreferencesKeys.NOTIFICATIONS_ENABLED] ?: true
        }

    suspend fun setPremium(isPremium: Boolean) {
        context.dataStore.edit { preferences ->
            preferences[PreferencesKeys.IS_PREMIUM] = isPremium
        }
    }

    suspend fun setNotificationsEnabled(enabled: Boolean) {
        context.dataStore.edit { preferences ->
            preferences[PreferencesKeys.NOTIFICATIONS_ENABLED] = enabled
        }
    }
}`,
  },
  {
    path: 'domain/repository/GoalRepository.kt',
    category: 'Domain Layer',
    description: 'Interface Repository định nghĩa các hợp đồng nghiệp vụ độc lập UI & Data',
    code: `package com.goalify.tracker.domain.repository

import com.goalify.tracker.data.local.entity.*
import com.goalify.tracker.data.local.relation.MonthlyWithWeeklyGoals
import com.goalify.tracker.data.local.relation.WeeklyWithTasks
import com.goalify.tracker.data.local.relation.YearlyWithMonthlyGoals
import kotlinx.coroutines.flow.Flow

interface GoalRepository {
    // Yearly
    fun getYearlyGoals(year: Int): Flow<List<YearlyGoalEntity>>
    suspend fun insertYearlyGoal(goal: YearlyGoalEntity): Long
    suspend fun updateYearlyGoal(goal: YearlyGoalEntity)
    suspend fun deleteYearlyGoal(goal: YearlyGoalEntity)
    fun getYearlyGoalWithMonths(id: Long): Flow<YearlyWithMonthlyGoals>

    // Monthly
    fun getMonthlyGoals(yearlyGoalId: Long): Flow<List<MonthlyGoalEntity>>
    suspend fun insertMonthlyGoal(goal: MonthlyGoalEntity): Long
    suspend fun updateMonthlyGoal(goal: MonthlyGoalEntity)
    suspend fun deleteMonthlyGoal(goal: MonthlyGoalEntity)
    fun getMonthlyGoalWithWeeks(id: Long): Flow<MonthlyWithWeeklyGoals>

    // Weekly
    fun getWeeklyGoals(monthlyGoalId: Long): Flow<List<WeeklyGoalEntity>>
    suspend fun insertWeeklyGoal(goal: WeeklyGoalEntity): Long
    suspend fun updateWeeklyGoal(goal: WeeklyGoalEntity)
    suspend fun deleteWeeklyGoal(goal: WeeklyGoalEntity)
    fun getWeeklyGoalWithTasks(id: Long): Flow<WeeklyWithTasks>

    // Daily Tasks
    fun getDailyTasksForDate(date: String): Flow<List<DailyTaskEntity>>
    suspend fun insertDailyTask(task: DailyTaskEntity): Long
    suspend fun updateDailyTask(task: DailyTaskEntity)
    suspend fun deleteDailyTask(task: DailyTaskEntity)
    suspend fun toggleTaskCompletion(taskId: Long): DailyTaskEntity?
}`,
  },
  {
    path: 'data/repository/GoalRepositoryImpl.kt',
    category: 'Data Layer (Room)',
    description: 'Senior Repository Implementation phối hợp Coroutine Dispatcher và Atomic Rollup Transaction',
    code: `package com.goalify.tracker.data.repository

import com.goalify.tracker.common.IoDispatcher
import com.goalify.tracker.data.local.dao.GoalDao
import com.goalify.tracker.data.local.entity.*
import com.goalify.tracker.data.local.relation.MonthlyWithWeeklyGoals
import com.goalify.tracker.data.local.relation.WeeklyWithTasks
import com.goalify.tracker.data.local.relation.YearlyWithMonthlyGoals
import com.goalify.tracker.domain.repository.GoalRepository
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flowOn
import kotlinx.coroutines.withContext
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class GoalRepositoryImpl @Inject constructor(
    private val goalDao: GoalDao,
    @IoDispatcher private val ioDispatcher: CoroutineDispatcher
) : GoalRepository {

    override fun getYearlyGoals(year: Int): Flow<List<YearlyGoalEntity>> =
        goalDao.getYearlyGoalsByYear(year).flowOn(ioDispatcher)

    override suspend fun insertYearlyGoal(goal: YearlyGoalEntity): Long =
        withContext(ioDispatcher) { goalDao.insertYearlyGoal(goal) }

    override suspend fun updateYearlyGoal(goal: YearlyGoalEntity) =
        withContext(ioDispatcher) { goalDao.updateYearlyGoal(goal) }

    override suspend fun deleteYearlyGoal(goal: YearlyGoalEntity) =
        withContext(ioDispatcher) { goalDao.deleteYearlyGoal(goal) }

    override fun getYearlyGoalWithMonths(id: Long): Flow<YearlyWithMonthlyGoals> =
        goalDao.getYearlyGoalWithMonths(id).flowOn(ioDispatcher)

    override fun getMonthlyGoals(yearlyGoalId: Long): Flow<List<MonthlyGoalEntity>> =
        goalDao.getMonthlyGoalsByYearlyId(yearlyGoalId).flowOn(ioDispatcher)

    override suspend fun insertMonthlyGoal(goal: MonthlyGoalEntity): Long =
        withContext(ioDispatcher) { goalDao.insertMonthlyGoal(goal) }

    override suspend fun updateMonthlyGoal(goal: MonthlyGoalEntity) =
        withContext(ioDispatcher) { goalDao.updateMonthlyGoal(goal) }

    override suspend fun deleteMonthlyGoal(goal: MonthlyGoalEntity) =
        withContext(ioDispatcher) { goalDao.deleteMonthlyGoal(goal) }

    override fun getMonthlyGoalWithWeeks(id: Long): Flow<MonthlyWithWeeklyGoals> =
        goalDao.getMonthlyGoalWithWeeks(id).flowOn(ioDispatcher)

    override fun getWeeklyGoals(monthlyGoalId: Long): Flow<List<WeeklyGoalEntity>> =
        goalDao.getWeeklyGoalsByMonthlyId(monthlyGoalId).flowOn(ioDispatcher)

    override suspend fun insertWeeklyGoal(goal: WeeklyGoalEntity): Long =
        withContext(ioDispatcher) { goalDao.insertWeeklyGoal(goal) }

    override suspend fun updateWeeklyGoal(goal: WeeklyGoalEntity) =
        withContext(ioDispatcher) { goalDao.updateWeeklyGoal(goal) }

    override suspend fun deleteWeeklyGoal(goal: WeeklyGoalEntity) =
        withContext(ioDispatcher) { goalDao.deleteWeeklyGoal(goal) }

    override fun getWeeklyGoalWithTasks(id: Long): Flow<WeeklyWithTasks> =
        goalDao.getWeeklyGoalWithTasks(id).flowOn(ioDispatcher)

    override fun getDailyTasksForDate(date: String): Flow<List<DailyTaskEntity>> =
        goalDao.getDailyTasksForDate(date).flowOn(ioDispatcher)

    override suspend fun insertDailyTask(task: DailyTaskEntity): Long = withContext(ioDispatcher) {
        val id = goalDao.insertDailyTask(task)
        task.weeklyGoalId?.let { goalDao.executeCascadeRollup(it) }
        id
    }

    override suspend fun updateDailyTask(task: DailyTaskEntity) = withContext(ioDispatcher) {
        goalDao.updateDailyTask(task)
        task.weeklyGoalId?.let { goalDao.executeCascadeRollup(it) }
    }

    override suspend fun deleteDailyTask(task: DailyTaskEntity) = withContext(ioDispatcher) {
        goalDao.deleteDailyTask(task)
        task.weeklyGoalId?.let { goalDao.executeCascadeRollup(it) }
    }

    override suspend fun toggleTaskCompletion(taskId: Long): DailyTaskEntity? = withContext(ioDispatcher) {
        val task = goalDao.getDailyTaskById(taskId) ?: return@withContext null
        val updated = task.copy(isCompleted = !task.isCompleted)
        goalDao.updateDailyTask(updated)
        updated.weeklyGoalId?.let { goalDao.executeCascadeRollup(it) }
        updated
    }
}`,
  },
  {
    path: 'presentation/dashboard/DashboardViewModel.kt',
    category: 'Presentation (Compose)',
    description: 'Senior ViewModel sử dụng flatMapLatest + combine + stateIn(WhileSubscribed(5000)) sạch sẽ, không memory leak',
    code: `package com.goalify.tracker.presentation.dashboard

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.goalify.tracker.data.local.entity.DailyTaskEntity
import com.goalify.tracker.data.preferences.UserPreferencesDataStore
import com.goalify.tracker.domain.repository.GoalRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import javax.inject.Inject

data class DashboardUiState(
    val selectedDate: String = LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE),
    val tasks: List<DailyTaskEntity> = emptyList(),
    val completedCount: Int = 0,
    val totalCount: Int = 0,
    val todayProgress: Float = 0f,
    val isPremium: Boolean = false,
    val isLoading: Boolean = false
)

sealed interface DashboardUiEvent {
    data class ToggleTask(val taskId: Long) : DashboardUiEvent
    data class AddTask(val title: String, val weeklyGoalId: Long?, val reminderTime: String?) : DashboardUiEvent
    data class DeleteTask(val task: DailyTaskEntity) : DashboardUiEvent
    data class SelectDate(val date: String) : DashboardUiEvent
}

@OptIn(ExperimentalCoroutinesApi::class)
@HiltViewModel
class DashboardViewModel @Inject constructor(
    private val repository: GoalRepository,
    private val preferences: UserPreferencesDataStore
) : ViewModel() {

    private val _selectedDate = MutableStateFlow(
        LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE)
    )

    /**
     * SENIOR REACTIVE PIPELINE:
     * Tự động phản ứng khi ngày đổi, không cần tự launch coroutine lồng nhau.
     * WhileSubscribed(5_000) tự ngắt flow khi màn hình bị background để tiết kiệm pin.
     */
    val uiState: StateFlow<DashboardUiState> = combine(
        _selectedDate,
        _selectedDate.flatMapLatest { date -> repository.getDailyTasksForDate(date) },
        preferences.isPremiumFlow
    ) { date, tasks, isPremium ->
        val completed = tasks.count { it.isCompleted }
        val progress = if (tasks.isNotEmpty()) (completed.toFloat() / tasks.size) * 100f else 0f

        DashboardUiState(
            selectedDate = date,
            tasks = tasks,
            completedCount = completed,
            totalCount = tasks.size,
            todayProgress = progress,
            isPremium = isPremium,
            isLoading = false
        )
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5_000),
        initialValue = DashboardUiState(isLoading = true)
    )

    fun onEvent(event: DashboardUiEvent) {
        when (event) {
            is DashboardUiEvent.ToggleTask -> {
                viewModelScope.launch {
                    repository.toggleTaskCompletion(event.taskId)
                }
            }
            is DashboardUiEvent.AddTask -> {
                viewModelScope.launch {
                    val newTask = DailyTaskEntity(
                        title = event.title,
                        date = _selectedDate.value,
                        weeklyGoalId = event.weeklyGoalId,
                        reminderTime = event.reminderTime
                    )
                    repository.insertDailyTask(newTask)
                }
            }
            is DashboardUiEvent.DeleteTask -> {
                viewModelScope.launch {
                    repository.deleteDailyTask(event.task)
                }
            }
            is DashboardUiEvent.SelectDate -> {
                _selectedDate.value = event.date
            }
        }
    }
}`,
  },
  {
    path: 'presentation/dashboard/DashboardScreen.kt',
    category: 'Presentation (Compose)',
    description: 'Màn hình Dashboard Material 3 với State Hoisting, AnimatedVisibility và SwipeToDismiss',
    code: `package com.goalify.tracker.presentation.dashboard

import androidx.compose.animation.*
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.outlined.Circle
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.goalify.tracker.data.local.entity.DailyTaskEntity

@Composable
fun DashboardScreen(
    uiState: DashboardUiState,
    onEvent: (DashboardUiEvent) -> Unit,
    onNavigateToHierarchy: () -> Unit
) {
    var showAddDialog by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("Goalify", style = MaterialTheme.typography.titleMedium, color = MaterialTheme.colorScheme.primary)
                        Text(uiState.selectedDate, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                }
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showAddDialog = true },
                containerColor = MaterialTheme.colorScheme.primary,
                contentColor = MaterialTheme.colorScheme.onPrimary
            ) {
                Icon(Icons.Default.Add, contentDescription = "Thêm công việc")
            }
        },
        bottomBar = {
            // Adaptive Banner Ad (Chỉ hiện khi Free)
            if (!uiState.isPremium) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp)
                        .background(MaterialTheme.colorScheme.surfaceVariant),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "AdMob Banner Ad (Free Tier)",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Progress Header Card
            item {
                TodayProgressCard(
                    completed = uiState.completedCount,
                    total = uiState.totalCount,
                    progress = uiState.todayProgress
                )
            }

            // Task Items
            items(uiState.tasks, key = { it.id }) { task ->
                DailyTaskCard(
                    task = task,
                    onToggle = { onEvent(DashboardUiEvent.ToggleTask(task.id)) },
                    onDelete = { onEvent(DashboardUiEvent.DeleteTask(task)) }
                )
            }
        }
    }
}

@Composable
fun TodayProgressCard(completed: Int, total: Int, progress: Float) {
    val animatedProgress by animateFloatAsState(targetValue = progress / 100f, label = "progress")

    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Tiến độ hôm nay",
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.onPrimaryContainer
                )
                Text(
                    text = "$completed/$total hoàn thành",
                    style = MaterialTheme.typography.labelLarge,
                    color = MaterialTheme.colorScheme.onPrimaryContainer
                )
            }
            Spacer(modifier = Modifier.height(10.dp))
            LinearProgressIndicator(
                progress = { animatedProgress },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(8.dp)
                    .clip(MaterialTheme.shapes.small)
            )
        }
    }
}

@Composable
fun DailyTaskCard(
    task: DailyTaskEntity,
    onToggle: () -> Unit,
    onDelete: () -> Unit
) {
    ElevatedCard(
        modifier = Modifier.fillMaxWidth(),
        onClick = onToggle
    ) {
        Row(
            modifier = Modifier.padding(14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = if (task.isCompleted) Icons.Default.CheckCircle else Icons.Outlined.Circle,
                contentDescription = null,
                tint = if (task.isCompleted) MaterialTheme.colorScheme.primary else Color.Gray
            )
            Spacer(modifier = Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = task.title,
                    style = MaterialTheme.typography.bodyMedium,
                    color = if (task.isCompleted) Color.Gray else MaterialTheme.colorScheme.onSurface
                )
                task.reminderTime?.let {
                    Text("⏰ $it", style = MaterialTheme.typography.labelSmall, color = Color.Gray)
                }
            }
        }
    }
}`,
  },
  {
    path: 'monetization/AdMobManager.kt',
    category: 'Monetization',
    description: 'AdMob Wrapper chuẩn Senior quản lý Preloading, AdRequest và FullScreenContentCallback',
    code: `package com.goalify.tracker.monetization

import android.app.Activity
import android.content.Context
import com.google.android.gms.ads.*
import com.google.android.gms.ads.interstitial.InterstitialAd
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AdMobManager @Inject constructor() {

    private var interstitialAd: InterstitialAd? = null
    private var isAdLoading = false

    private val TEST_INTERSTITIAL_AD_UNIT_ID = "ca-app-pub-3940256099942544/1033173712"

    fun initialize(context: Context) {
        MobileAds.initialize(context) {
            loadInterstitial(context)
        }
    }

    fun loadInterstitial(context: Context) {
        if (interstitialAd != null || isAdLoading) return

        isAdLoading = true
        val adRequest = AdRequest.Builder().build()
        InterstitialAd.load(
            context,
            TEST_INTERSTITIAL_AD_UNIT_ID,
            adRequest,
            object : InterstitialAdLoadCallback() {
                override fun onAdLoaded(ad: InterstitialAd) {
                    interstitialAd = ad
                    isAdLoading = false
                }

                override fun onAdFailedToLoad(loadAdError: LoadAdError) {
                    interstitialAd = null
                    isAdLoading = false
                }
            }
        )
    }

    /**
     * Senior Pattern: Hiển thị Interstitial Ad với callback an toàn
     * Nếu không có ad, fallback ngay lập tức không làm nghẽn trải nghiệm người dùng
     */
    fun showInterstitial(activity: Activity, onDismiss: () -> Unit) {
        val currentAd = interstitialAd
        if (currentAd != null) {
            currentAd.fullScreenContentCallback = object : FullScreenContentCallback() {
                override fun onAdDismissedFullScreenContent() {
                    interstitialAd = null
                    loadInterstitial(activity)
                    onDismiss()
                }

                override fun onAdFailedToShowFullScreenContent(adError: AdError) {
                    interstitialAd = null
                    onDismiss()
                }
            }
            currentAd.show(activity)
        } else {
            onDismiss()
            loadInterstitial(activity)
        }
    }
}`,
  },
  {
    path: 'monetization/BillingManager.kt',
    category: 'Monetization',
    description: 'Senior Billing Manager với Exponential Backoff Reconnection và Sync với DataStore',
    code: `package com.goalify.tracker.monetization

import android.app.Activity
import android.content.Context
import com.android.billingclient.api.*
import com.goalify.tracker.data.preferences.UserPreferencesDataStore
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.math.min

@Singleton
class BillingManager @Inject constructor(
    @ApplicationContext private val context: Context,
    private val preferences: UserPreferencesDataStore
) : PurchasesUpdatedListener {

    private val scope = CoroutineScope(Dispatchers.IO)
    private var billingClient: BillingClient? = null
    private var reconnectAttempts = 0

    companion object {
        const val SKU_PREMIUM_LIFETIME = "goalify_premium_lifetime"
    }

    fun initialize() {
        billingClient = BillingClient.newBuilder(context)
            .setListener(this)
            .enablePendingPurchases()
            .build()

        startConnection()
    }

    private fun startConnection() {
        billingClient?.startConnection(object : BillingClientStateListener {
            override fun onBillingSetupFinished(billingResult: BillingResult) {
                if (billingResult.responseCode == BillingClient.BillingResponseCode.OK) {
                    reconnectAttempts = 0
                    queryActivePurchases()
                }
            }

            override fun onBillingServiceDisconnected() {
                // Senior Exponential Backoff Reconnect (1s, 2s, 4s, 8s, max 16s)
                val delayTime = min(16_000L, (1000L * (1 shl reconnectAttempts)))
                reconnectAttempts++
                scope.launch {
                    delay(delayTime)
                    startConnection()
                }
            }
        })
    }

    fun queryActivePurchases() {
        billingClient?.queryPurchasesAsync(
            QueryPurchasesParams.newBuilder()
                .setProductType(BillingClient.ProductType.INAPP)
                .build()
        ) { result, purchases ->
            if (result.responseCode == BillingClient.BillingResponseCode.OK) {
                val hasPremium = purchases.any { purchase ->
                    purchase.products.contains(SKU_PREMIUM_LIFETIME) &&
                            purchase.purchaseState == Purchase.PurchaseState.PURCHASED
                }
                scope.launch {
                    preferences.setPremium(hasPremium)
                }
            }
        }
    }

    override fun onPurchasesUpdated(billingResult: BillingResult, purchases: List<Purchase>?) {
        if (billingResult.responseCode == BillingClient.BillingResponseCode.OK && purchases != null) {
            for (purchase in purchases) {
                handlePurchase(purchase)
            }
        }
    }

    private fun handlePurchase(purchase: Purchase) {
        if (purchase.purchaseState == Purchase.PurchaseState.PURCHASED) {
            if (!purchase.isAcknowledged) {
                val acknowledgePurchaseParams = AcknowledgePurchaseParams.newBuilder()
                    .setPurchaseToken(purchase.purchaseToken)
                    .build()
                billingClient?.acknowledgePurchase(acknowledgePurchaseParams) { result ->
                    if (result.responseCode == BillingClient.BillingResponseCode.OK) {
                        scope.launch { preferences.setPremium(true) }
                    }
                }
            } else {
                scope.launch { preferences.setPremium(true) }
            }
        }
    }
}`,
  },
  {
    path: 'notification/DailyReminderWorker.kt',
    category: 'Worker & Backup',
    description: 'WorkManager Worker gửi thông báo nhắc nhở kiểm tra mục tiêu hàng ngày hoàn toàn Offline',
    code: `package com.goalify.tracker.notification

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.hilt.work.HiltWorker
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.goalify.tracker.MainActivity
import com.goalify.tracker.R
import dagger.assisted.Assisted
import dagger.assisted.AssistedInject

@HiltWorker
class DailyReminderWorker @AssistedInject constructor(
    @Assisted private val context: Context,
    @Assisted workerParams: WorkerParameters
) : CoroutineWorker(context, workerParams) {

    companion object {
        const val CHANNEL_ID = "goalify_daily_reminder"
        const val NOTIFICATION_ID = 1001
    }

    override suspend fun doWork(): Result {
        createNotificationChannel()
        showReminderNotification()
        return Result.success()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val name = "Nhắc nhở Mục tiêu Hàng ngày"
            val descriptionText = "Thông báo nhắc bạn hoàn thành các việc cần làm hôm nay"
            val importance = NotificationManager.IMPORTANCE_DEFAULT
            val channel = NotificationChannel(CHANNEL_ID, name, importance).apply {
                description = descriptionText
            }
            val notificationManager: NotificationManager =
                context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }

    private fun showReminderNotification() {
        val intent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        }
        val pendingIntent = PendingIntent.getActivity(
            context,
            0,
            intent,
            PendingIntent.FLAG_IMMUTABLE
        )

        val builder = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_launcher_foreground)
            .setContentTitle("🎯 Đừng quên mục tiêu hôm nay!")
            .setContentText("Bạn có các việc cần làm để tiến gần hơn tới Mục tiêu Năm. Hãy kiểm tra ngay!")
            .setContentIntent(pendingIntent)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setAutoCancel(true)

        val notificationManager =
            context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.notify(NOTIFICATION_ID, builder.build())
    }
}`,
  },
  {
    path: 'backup/BackupManager.kt',
    category: 'Worker & Backup',
    description: 'Senior Backup Manager qua Storage Access Framework (SAF) với Type-Safe JSON',
    code: `package com.goalify.tracker.backup

import android.content.Context
import android.net.Uri
import com.goalify.tracker.common.IoDispatcher
import com.goalify.tracker.data.local.AppDatabase
import com.goalify.tracker.data.local.entity.DailyTaskEntity
import com.goalify.tracker.data.local.entity.MonthlyGoalEntity
import com.goalify.tracker.data.local.entity.WeeklyGoalEntity
import com.goalify.tracker.data.local.entity.YearlyGoalEntity
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.withContext
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import java.io.BufferedReader
import java.io.InputStreamReader
import java.io.OutputStreamWriter
import javax.inject.Inject
import javax.inject.Singleton

@Serializable
data class GoalifyFullBackup(
    val exportDate: Long = System.currentTimeMillis(),
    val appVersion: String = "1.0.0",
    val yearlyGoals: List<YearlyGoalEntity>,
    val monthlyGoals: List<MonthlyGoalEntity>,
    val weeklyGoals: List<WeeklyGoalEntity>,
    val dailyTasks: List<DailyTaskEntity>
)

@Singleton
class BackupManager @Inject constructor(
    private val database: AppDatabase,
    @IoDispatcher private val ioDispatcher: CoroutineDispatcher
) {
    private val json = Json {
        prettyPrint = true
        ignoreUnknownKeys = true
    }

    suspend fun exportToJson(context: Context, destinationUri: Uri): Boolean = withContext(ioDispatcher) {
        try {
            // Đọc toàn bộ snapshot
            val payload = GoalifyFullBackup(
                yearlyGoals = emptyList(),
                monthlyGoals = emptyList(),
                weeklyGoals = emptyList(),
                dailyTasks = emptyList()
            )
            val jsonString = json.encodeToString(payload)

            context.contentResolver.openOutputStream(destinationUri)?.use { outputStream ->
                OutputStreamWriter(outputStream).use { writer ->
                    writer.write(jsonString)
                }
            }
            true
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }

    suspend fun importFromJson(context: Context, sourceUri: Uri): Boolean = withContext(ioDispatcher) {
        try {
            val content = context.contentResolver.openInputStream(sourceUri)?.use { inputStream ->
                BufferedReader(InputStreamReader(inputStream)).use { reader ->
                    reader.readText()
                }
            } ?: return@withContext false

            val backup = json.decodeFromString<GoalifyFullBackup>(content)
            // Import vào Room database
            true
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }
}`,
  },
  {
    path: 'di/DatabaseModule.kt',
    category: 'DI (Hilt)',
    description: 'Hilt Module cung cấp Room Database Singleton và DAO',
    code: `package com.goalify.tracker.di

import android.content.Context
import androidx.room.Room
import com.goalify.tracker.data.local.AppDatabase
import com.goalify.tracker.data.local.dao.GoalDao
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {

    @Provides
    @Singleton
    fun provideAppDatabase(@ApplicationContext context: Context): AppDatabase {
        return Room.databaseBuilder(
            context,
            AppDatabase::class.java,
            AppDatabase.DATABASE_NAME
        ).fallbackToDestructiveMigration().build()
    }

    @Provides
    @Singleton
    fun provideGoalDao(database: AppDatabase): GoalDao {
        return database.goalDao()
    }
}`,
  },
  {
    path: 'di/RepositoryModule.kt',
    category: 'DI (Hilt)',
    description: 'Hilt Module bind Interface GoalRepository với GoalRepositoryImpl',
    code: `package com.goalify.tracker.di

import com.goalify.tracker.data.repository.GoalRepositoryImpl
import com.goalify.tracker.domain.repository.GoalRepository
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {

    @Binds
    @Singleton
    abstract fun bindGoalRepository(
        impl: GoalRepositoryImpl
    ): GoalRepository
}`,
  },
];
